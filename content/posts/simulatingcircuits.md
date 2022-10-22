+++
title = "Simulating Electric Circuits"
date = "2022-10-22T10:57:12+01:00"
author = "abundance"
authorTwitter = "abundance" #do not include @
cover = ""
tags = []
keywords = []
description = ""
showFullContent = false
readingTime = false
hideComments = false
+++



you probably didn't know this 
but I'm a Computer Engineering major 

for a while i've been a having lot of classes on circuit theory(I find it unnecesarily complex and annoying beyond reason -_-)
but one cool thing i've noticed during classes is that electrical circuits are an intricately complex system
with lots of simple rules that scale to form interesting patterns also
(mainly because most of moving pieces involved are very clearly  defined and for most of the analysis we usually focus on ideals -this doesn't mean by any chance that I enjoy the subject in anyway 
I hope circuit theory burns :angry) 

but it does seems like something that could be really nice to write a simulation for 

now i'm a pretty lazy person 
and when i have a cool idea like this i usually just check  for a decently good implementation of it  and see if i understand at least some of what they did 
or at the very least look for a specification and just implement that for sport or something 

but I checked and a lot of the solutions out there are like high up professional grade stuff that my brain is too small to fathom 
and they dont really cover the use case i'm looking for (doing my homework :hehe)

so this time I figured I'd implement it myself(hopefully this isn't a big waste of time)



The first thing I had to figure out was how to represent an electric ciruit with text and verify that the circuits are valid 
(and build a simple parser for whatever I come up with)
at the start of this I had absolutely no intention of figuring that out on my own because it honestly seemed like a looooot of work 
(me no like work)
but it was suprisingly shocking how little effort had been put towards solving that basic problem(text representation for circuits)
even after expert googling(trust me i tried)
I only found one random ass electronic stack exchange where the question was asked 
and all the guys that replied pointed out this thing called a SPICE netlist


{{< figure src="img/splice.png" alt="" position="center" style="border-radius: 8px;" caption="" captionPosition="right" captionStyle="color: red;" >}}

I checked the syntax and honestly i'll probably figure out a cure to cancer before i build anything to interpret that mess
(a more constructive argument would be that i think it focused way to much on circuit connections in practice and not the conceptual thing so it seems more like instructions for patching a circuit than a representation and that's not really what i'm going for)

anyways as you probably guessed by now 
i was on my own 
and it was time to put on my big brain hat and figure this out
i got my sad indie playlist queued up (dont judge me)
and got to work 


