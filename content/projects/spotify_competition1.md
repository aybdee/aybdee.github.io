the initial model for candidate selection was WRMF(weight regularized matrix factorization)  
from the name its pretty easy to assume what it's supposed to be doing 

basically matrix factorization as used in regular collaborative filtering problems 

where the userxitem ie preferences/ratings or whatever floats your boat is factorized into user and item embeddings that can be used for subsequent predictions 

I think the regularization employed here is just for more efficiently learning (something i think is pretty relevant in this case since we've got like 20k.....) 
the creators of v16 link to a paper that more or less describes their specific approach to WRMF 
(Collaborative Filtering for Immediate Feedback Datasets)

it starts by distinguishing what immediate feedback recommendation problems  are and the unique challenges that come as a result 

(can't really do the whole thing that would take forever) 

for the most part,Implicit feedback problems occur when there aren't any explicit(for lack of better word) metrics by which users rank the items that they interact with (usually in the form of a star rating or a ranking or something like that)
instead what you have is just the data on how the user interacts with items , so stuff like how many times they bought something or clickedon a product)


generating recommendations for users from implicit feedback data is significantly different 
one because there isn't any way of quantifying negative preference with the data 
(in a ranking system a 1 star rating means the user probably dislikes the product but there's no such thing as negatively clicking a lick)

and then there's also the fact that these kinds of data tend to be more noisy because not all interactions might come from the user 
(this is something that is largely mitigated with rating systems because most people ranking and starring products are doing it to show their personal preference in some way and would rarely bother ranking when someone else is involved)

lastly is just the increase in the overall complexity of the model for solving the problem 
with a simple numerical rating the problem is just to predict a specific score and
the metrics for model success are pretty clear 
something like root mean square could probably suffice 

with Implicit feedback it's a little different '
since we're working with user interactions 
the model is predicting the likelihood of the user performing a certain interaction 
for all possible interactions

(that means we'll have to consider things like  availability of the item(whether the interaction can even happen in the first place), 
competition with other items, and repeat feedback(not quite sure what this is))







