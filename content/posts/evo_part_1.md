+++
title = "Building Evo Part 1"
draft=false
date = "2024-10-26T05:57:12+01:00"
author = "abundance"
authorTwitter = "aybdee" #do not include @
cover = ""
tags = ["rust","simulation"]
keywords = []
description = ""
showFullContent = false
readingTime = false
hideComments = false
+++

A few months ago, I saw this really cool [YouTube video](https://www.youtube.com/watch?v=N3tRFayqVtk&t=1366s) demonstrating a simulation of evolution through natural selection, and it blew my mind. As such, I thought it'd be a good idea to try and recreate the system, and here we are. It's been quite a while since I decided to do this, and there have been a lot of weird hitches and changes. But I eventually reached a decent point in the project and thought it'd be a good idea to write about it.

## So... What is Evo?

Evo is a system that simulates natural selection. Well, what is natural selection? It's basically a process where organisms better adapted to their environment tend to survive and reproduce, passing on favorable traits to their offspring. Over generations, this leads to the evolution of populations.  
The point of Evo is to try to replicate this digitally, creating a small world where "digital organisms" evolve to adapt to their environment.

The neural network for each organism is encoded as a "genome," which is just a string representation of the network’s structure and weights. Analogous to biology, the genome defines the organism's behavior.

To simulate natural selection, you need organisms. The way we represent the organisms in this system is with a simple neural net.  
If you haven't heard of those, a neural net is a system inspired by the human brain. It consists of layers of interconnected nodes (neurons). 

To make organisms from neural nets, we implement them such that the input neurons take in information from the organism's environment (basically its senses), and the output neurons cause the organism to perform an action.

A string representation of this neural net is called a genome (like in biology), and it completely represents the behavior patterns of the organism. To keep things analogous with biology, a gene in this system is just a connection between neurons in the neural net. This allows us to say that genomes are made of genes, just like we would in biological organisms. Also, because it's not really practical to read through lines of genomes for the organisms in our simulation, we represent each genome as a color such that similar genomes (i.e., similar behavior) are represented with similar colors.

Now that we're mostly up to speed with how the organisms would work, how would natural selection work in this system?

First, natural selection is something that occurs over generations, so these organisms would have to reproduce in some way and eventually die off.  
Next, the only reason natural selection occurs is that there's some adversity in the system that causes some organisms to die and others to live depending on how they behave.  
In this system, the adversity is just having live and die zones in the simulation—basically, parts of the environment where if the organism gets to them, they'd live, and if they don't, they'd die.  
The organisms that don't die get to reproduce sexually. The way this works is that two organisms are selected at random from the environment, and parts of their genomes are combined to create a new genome representing a new organism.

The hope with this experiment (well, it's more of the expected result because I've seen it work already) is that by killing off the "unfit" organisms and allowing the more "fit" ones to reproduce, we create a pool of organisms whose genetics allow them to easily survive in the environment. And that is called... *drumroll*... natural selection.

## How am I building Evo?  

Well, I'm writing it completely in Rust. For the graphics, I initially started using SDL2 but then switched to Bevy (I'll probably write more about why later). I'll add more implementation details as I write more.  