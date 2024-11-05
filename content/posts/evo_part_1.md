+++
title = "Building Evo Part 1"
draft=true
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

A few months ago i saw this really cool [youtube video](https://www.youtube.com/watch?v=N3tRFayqVtk&t=1366s) demonstrating a simulation of evolution through natural selection and it blew my mind as such, i thought it'd be a good idea to try and recreate the system, and here we are. it's been quite a bit since i decided to do this and there's been a lot of weird hitches and changes. but i eventually came around to a decent point in the project and thought it'd be a good idea to write about it.

## So.. What is Evo

Evo is a system that simulates natural selection, well ... what is natural selection ?

to simulate natural selection you need organisms and the way we represent the organisms in this system is with a simple neural net
if you haven't heard of those, a neural net is ..

to make organisms from neural nets we implement the neural nets such that the input neurons take in information from the organisms environment and the output neuron causes the organism to perform an action

//example to make things clearer

(now we're mostly up to speed with how the organisms would work) how would natural selection work in this system

First, natural selection is something that occurs over generations, so these organisms would have to reproduce in some way and eventually die off. Next, the only reason natural selection occurs is because there's some adversity in the system that causes some organisms to die and some others to live depending on how they behave,
in this system the adversity is just having live and die zones in the simulation, basically parts of the environment where if the organism gets to they'd live, and if they dont get to they'd die
