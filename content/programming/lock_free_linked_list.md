
+++
title = "Hariss Lock Free Linked List"
draft=false
date = "2026-03-08T12:23:12+01:00"
author = "abundance"
authorTwitter = "aybdee" #do not include @
cover = ""
tags = ["c++","distributed systems"]
keywords = []
description = ""
showFullContent = false
readingTime = false
hideComments = false
+++

Intuitively, I've always understood lock-free algorithms/data structures to be an approach to multithreaded programming that doesn't involve using "locks". Locks here mean any general mechanism used to "protect" memory so that multiple threads don't, for instance, write to it at the same time. This typically involves one thread acquiring and owning the lock, while other threads have to wait for the owning thread to "free" the lock, allowing them to eventually access the data.

The issue with lock-based data structures though is that sometimes a thread can fail without "releasing" the lock, and so other threads that are waiting for the lock so they can access some memory are stuck and can't do anything. This brings us to the canonical definition of lock-free data structures/algorithms.

A **lock-free algorithm** guarantees that **at least one thread always makes progress**, regardless of what happens to the others. In other words, even if some threads are delayed, suspended, or crash entirely, the system as a whole will continue to move forward.

In practice, achieving this means carefully orchestrating the procedures so that operations performed by different threads don't require exclusive ownership of shared data. Instead, updates are structured in such a way that threads can **optimistically read state, attempt to update it, and retry if the state changed underneath them**.

We usually achieve this with **atomic operations**.

Because it's notoriously difficult to come up with lock-free algorithms in the general sense, what we typically have in practice are **lock-free data structures** built around a small number of atomic primitives.

The most important primitive for many lock-free algorithms is **Compare-And-Swap (CAS)**.

CAS takes three arguments:
- a memory location
- an expected value
- a new value
    

It atomically checks whether the memory location still contains the expected value, and if it does, replaces it with the new value. If the value has changed in the meantime, the operation fails and returns false This entire operation happens **atomically at the hardware level**, meaning no other thread can observe a partially completed update.



# Harris Style Linked List

The Harris style linked list [1] mainly has 3 operations:
- insert
- delete
- search
    

The insertion and deletion are mostly self explanatory, and the search operation is used internally to locate where an operation should occur.

### Constraints

- It's an **ordered set** (elements are unique and are inserted in descending order).
- The operations are **linearizable**.
    
What linearizability means is essentially that for some sequence of operations that are carried out in parallel, there exists **some linear ordering of those operations that would produce the same final result**. From the perspective of an outside observer, it looks as if the operations happened one after another, even though they were actually happening concurrently.

---

# Searching

The search operation walks the list until it finds the correct position for a key.

Conceptually it returns two pointers:
- **pred** — the node immediately before the position of interest
- **curr** — the node at that position

```cpp
struct searchResult {
  Node *pred;
  Node *curr;
};
```

So if we are searching for `5` in:

```
1 -> 3 -> 7
```

The search result would be:

```
pred = 3
curr = 7
```

This pair of nodes represents the **window** where an insertion or deletion might occur.

During traversal, the search routine also skips over nodes that have been **logically deleted**(i'll get to what this means later), and may help physically remove them. 

```cpp
static searchResult search(int key, Node *left) {
    Node *pred = left;
    while (true) {
      Node *curr = Node::get_unmarked(pred->next.load());
      if (curr != nullptr) {
        Node *curr_next = curr->next.load();
        if (Node::is_marked(curr_next)) {
          Node *expected = curr;
          bool success = pred->next.compare_exchange_strong(
              expected, Node::get_unmarked(curr_next));
          if (success) {
            curr = Node::get_unmarked(curr_next);
          } else {
            return LinkedList::search(key, left);
          }
        }
      }
      if (curr == nullptr) {
        return searchResult{pred, curr};
      }

      if (pred->key < key && curr->key >= key) {
        return searchResult{pred, curr};
      } else {
        pred = curr;
      }
    }
  }
```

---

# Insertion

To Insert, first we do a search, and this gives us two pointers:
- one to the item before the insertion point (`pred`)
- one to the item after it (`curr`)
    
We then perform one CAS on the `pred` node, modifying its `next` pointer to point to a new node whose `next` pointer is `curr`.

We retry this CAS until it works.

Since a lot of the lock-free linked list implementation involves retrying CAS operations, I made a small template helper function to deal with it.

```cpp
template <typename Func>
void retry_until_success(Func &&func) {
  while (!func()) {
  }
}
```

And so the insert operation looks something like this:

```cpp
void insert(int key) {
  if (this->head == nullptr) {
    Node *new_node = new Node(key, nullptr);
    this->head = new_node;
  } else {
    retry_until_success([&]() -> bool {
      auto searchResult = search(key, this->head);
      Node *insertion_point = searchResult.pred;
      Node *new_node = new Node(key, searchResult.curr);
      Node *expected = searchResult.curr;

      return insertion_point->next.compare_exchange_strong(
        expected,
        new_node
      );
    });
  }
}
```

A very important detail here is that when we're doing the CAS we need to **recompute all the values used in the CAS operation**.

In this case that means **calling `search()` again each time before we try**.
We need to do this is because when a CAS fails it is usually because some assumption we made about the data structure no longer holds (for example the node we're trying to attach to might have been deleted or another node was inserted). Recomputing the values gives us an updated view of the structure before retrying.

---

# Deletion

The Harris style linked list performs deletion in **two phases**:

- Logical deletion — marking the node as deleted
- Physical deletion — actually unlinking the node from the list by updating it's predecessors `next` pointer

We separate these steps because there's a chance some other thread might still be using the node while we're attempting to delete it, so we can't safely free the memory immediately.

To actually find the node to delete we 
- do a search (this time the `curr` Node is the node we want to delete)
- perform a `CAS` to mark the `curr` Node as deleted

```cpp
  void remove(int key) {
    retry_until_success([&]() -> bool {
      auto searchResult = search(key, this->head);
      if (searchResult.curr == nullptr || searchResult.curr->key != key) {
        return true;
      }
      Node *expected = searchResult.curr->next;
      return searchResult.curr->next.compare_exchange_strong(
          expected, Node::get_marked(expected));
    });
  }
```

## Marking nodes as deleted

The first idea I had to mark a deleted node was to just do something like this (I was mostly using the Harris paper as a loose guideline at this point):

```cpp
class Node {
public:
  int key;
  bool deleted;
  atomic<Node *> next;
};
```

Maybe you're super smart and already see the pitfall with this approach (it took me a bit).

The issue becomes clear when you consider what happens when two different threads try to **insert into and delete the same node concurrently**.

Consider a list:

```
1 -> 3 -> 7
```

Thread A wants to insert `5`.  
It would do this by modifying the `next` pointer of `3` to point to a new node `5`.

Thread B wants to delete node `3`.

Execution might look like this:

```
Thread A: performs search → gets pointer to Node(3)
Thread B: marks Node(3) as deleted
Thread A: performs CAS on Node(3).next
```

Thread A executes:

```
CAS(Node(3).next, expected=Node(7), new=Node(5))
```

The CAS **succeeds**.

But this is wrong. we just inserted a node after a node that has already been deleted.

The problem is that B marked the node as deleted **after A had already read it**, and there is no way for A to observe that change because the CAS only checks the `next` pointer.

Reloading the node doesn't really solve the problem either, because the change we care about lives **outside the memory location we're doing CAS on**.

The only reliable way to propagate this information is to move the deletion marker **into the same field we're performing the CAS on**. That way, if it changes at any moment before our CAS executes, the CAS will fail and we'll retry with a fresh state.

---

## Pointer Marking

The way the Harris implementation achieves this is by **using the least significant bit (LSB) of the `next` pointer**.

When we want to logically delete a node, we mark it by setting the LSB of its `next` pointer to `1`.

So to delete `Node(3)` we would change:

```
3 -> 7
```

into

```
3 -> (7 | mark)
```

This indicates that the node is logically deleted.

My first concern when I read this solution was:  
**what if the next pointer already has its LSB set to 1?**

But this can't happen (at least on typical architectures like x86) because heap allocations are aligned to at least 8 or 16 bytes sso the least significant bit will always be zero. 

This allows us to turn the pointer:

```
0x...1000
```
to
```
0x...1001
```

to indicate "marked".

Whenever we read the pointer we can just **mask out the bit** to recover the real address.

---

## Other Stuff 
Something important I didn't talk about in this post is memory reclamation. We can't just call free after physically unlinking a node because some other thread could still be using it. To reclaim memory safely, we need a strategy that ensures no thread holds a reference to the node anymore before freeing it. Common approaches include hazard pointers, epoch-based reclamation, or RCU-style reclamation, which basically track which nodes are still “in use” and only free them once it's safe.

## References
1. Harris, T. L. (2001). A pragmatic implementation of non‑blocking linked‑lists. In Proceedings of the 15th International Symposium on Distributed Computing (DISC) (pp. 300–314). Springer‑Verlag
