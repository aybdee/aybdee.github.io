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



You probably didn't know this 
but I'm a Computer Engineering major 

For a while i've been a having lot of classes on circuit theory(I find it unnecesarily complex and annoying beyond reason -_-)
but one cool thing i've noticed during classes is that an electrical circuits are a pretty fascinating system
with lots of simple rules that scale to form interesting patterns. Also, most of moving pieces involved are very clearly  defined and for most of circuit analysis we usually focus on ideals so there's very little undefined behaviour  
(DISCLAIMER - this doesn't mean by any chance that I enjoy the subject in anyway 
(I hope circuit theory burns 😠)) 

but it does seem like something that could be really nice to write a simulation for 

now i'm a pretty lazy person 
and when i have a cool idea like this i usually just check  for a decently good implementation of it  and see if i understand at least some of what they did 
or at the very least look for a specification and just implement that for sport or something.  
I checked, and a lot of the solutions out there were like high up professional grade stuff that my brain was too small to fathom 
and they didn't really cover the use case i'm looking for (doing my homework :hehe)
so this time I figured I'd implement it myself(hopefully this isn't a big waste of time)



The first thing I had to figure out was how to represent an electric ciruit with text and verify that the circuits are valid 
(and build a simple parser for whatever I come up with)
at the start of this I had absolutely no intention of figuring that out on my own because it honestly seemed like a looooot of work 
(me no like work)
but it was suprisingly shocking how little effort had been put towards solving that basic problem(text representation for circuits)
even after expert googling(trust me i tried)
I only found one random ass electronic stack exchange where the question was asked 
and all the guys that replied pointed out this thing called a SPICE netlist
looks a little like this 
{{< figure src="/img/splice.jpg" alt="" position="center" style="border-radius: 8px;" caption="" captionPosition="right" captionStyle="color: red;" >}}

I checked the syntax and honestly i'll probably figure out a cure to cancer before i build anything to interpret that mess  
(a more constructive argument would be that i think it focused way to much on circuit connections in practice and not the conceptual thing so it seems more like instructions for patching a circuit than a representation and that's not really what i'm going for  
That and it looks like it was made in the 70's
)

anyways as you probably guessed by now 
i was on my own 
and it was time to put on my big brain hat and figure this out
i got my sad indie playlist queued up (dont judge me)
and got to work 
