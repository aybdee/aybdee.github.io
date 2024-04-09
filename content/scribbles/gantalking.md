+++
title = "Talking about GANS"
date = "2023-10-30T10:57:12+01:00"
author = "abundance"
authorTwitter = "abundance" #do not include @
cover = ""
tags = ["GANs", "machine learning","Deep Learning"]
keywords = []
description = ""
showFullContent = false
readingTime = false
hideComments = false
+++

think of an intro
(something about how you haven't done serious ML in a while and you decided to blitz through some GAN papers - maybe talk about how you want to colour manga using GANS (link to the paper) and how the paper didn't make any sense at first)

Before talking about GANS i think it'd be cool to talk about how computer scientists frame the problem of generating (data?)

we look at sample data(thats the patterns we want to generate as probability distributions) across some domain

if you're not familiar with the term

-- drop wikipedia? definition of probability distributions here

probability distributions are the way we represent the likelihood that some data sample will occur at a point(in some number space)

an example with the MNIST dataset(if you've never heard of it it's a dataset of handwritten digits sized 28x28)

since each image is 28x28 pixels we've got 784 (values?) for each image

say we represent that in a coordinate system with 784 dimensions(this isn't something people really do - if we needed to though we'd need to use some sort of dimensionality reduction first)

we'd have 784^(784) possible data points that could occur
but not every data point would be MNIST digits
in fact most of it would be noise

a probability distribution for MNIST basically gives us a value between 0 and 1 for each data point that represents how likely that point is to be a number, kinda like a description
all I'd need to do to (generate)? numbers if i had this distribution
is take the data points with a high probability in the distribution

so in a way we can think of generating taking points from a probability distribution of the items we're trying to generate (that are not included in the training set that we used to somehow do this)

ok so we're hopefully up to speed..

Generative Adversarial Networks work by trying to make a new probability distribution that is as similar as possible to the intrinsic distribution of our training data

since all the information we have about this "intrinsic" distribution is its samples(our training data) you can also say GANs try to estimate a probability distribution(think a description for out ) from its observed samples
