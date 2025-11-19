---
title: "Basics of SwiftUI"
subtitle: "notes"
date: "2023-02-03"
category: "Web"
tags:
  - Swift
  - SwiftUI
readTime: "8 min"
preview: "Notes learning CS193p"
---

This blog post is the notes I take while learning Stanford CS193p.

## view?
What does these codes do?
```swift
struct ContentView: View {
    var body: some View {
        return Text("Hello, World!")
    }
}
```
it's basically saying to the compiler 
"go look in my code right here, figure out what it's returning, make sure that it behaves like a view, and then use that as the type of the body."

**what does "return Foreach(iteratablething, content:{})" say?**
+ it's going to iterate over this iteratable thing, and for each of the thing, it will build one of these views.

How is the space on-screen apportioned to the views?
It's amazingly simple ...
1. Container Views(HStack, VStack, ...) "offer" space to the Views inside them.
2. Views then choose that size they want to be.
3. Container Views then position the Views inside of them.

### Container Views
They divide the space offered to them.
ForEach defers to its container to lay out the Views inside of it.
** offers space to its most "inflexible" views first.
Modifiers (e.g. .padding()) essentially "contain" the View they modify. Some do layout.

### @ViewBuilder 
add @ViewBuilder to the function which returns some View turns the thing in the curly brace into a list of Views.(2 ~ 10 Views as a TupleView)

### ViewModifier
Modifier a View and return a new View
They probably turn right and call a function in View called modifier.
.aspectRatio(2/3) -> .modifier(AspectRatio(2/3)) where AspectRatio() can be anything conforms to ViewModifier protocol

### Animation
Animation is a smoothed out portrayal in your UI...
... over a period of time (which is configurable and usually brief)
... of a change that has already happened (very recently)

point of animation is to make the user experience less abrupted and draw their attention to things that are changing

Animation works only on Views in container already on screen
only work on modifier
.animation is more like .font, it will pass down to everything inside the container
while .padding takes up space and pass the space left to the things inside the container

### Transitions
Transitions specify how to animate the arrival/departure of Views in CTAAOS.
Just a pair of ViewModifiers.
One of the modifier is the "before" viewmodifier of the View that's on the move
Another is the "after" one.
just a version of "changes in arguments to view modifiers" animation.
**Transition** is like .padding, attached to the whole ViewContainer

### image
Image serves as a View
UIImage is the type for actually creating / manipulating images and store in vars.
very powerful representation of an image

### Gestures
@GestureState var myGestureState = <starting value> 
it only changes when the gesture is active
when the gesture ends, the value is set to the starting value

## Multithreading
** never block your UI **


## MVVM Model-View-ViewModel
+ A "code organizing" architectural design paradigm.
+ Works in concert with the concept of "reactive" user-interfaces.
+ Must be **ahered to for swiftUI** to work.

MODEL
    UI independent
    Data + Logic --> "The truth"
    
↓            ↑
↓            ↑  notice changes in the model
↓ ViewModel  ↑  Binds View to Model, interpret 
↓            ↑  publish "something changed"  @ObservableObject, @Published
↓            ↑                               objectWillChange.send()
                                             .environmentObject()
                Process intent
                modify the model

VIEW (auto, observes, publications, pulls data and rebuilds)
    subscribes to the notification
    Reflects the Model
    stateless
    Declared (time independent)
    Reactive (reacting to changes in model)
    calls Intent function
```swift
@ObservedObject
@Binding
.onReceive
@EnvironmentObject
```
    
    //Old style ---> command mode (time dependent e.g. function calls)
    
## language

### struct
+ value type
+ copied when passed or assigned
+ copy on write
+ functional programming
+ "free" init initializes ALL vars
+ mutability must be explicitly stated
+ Your "goto" structure
+ everything so far is a struct (except View is a protocal)


### class
+ reference type
+ passed around via pointers
+ automatically reference counted (==0 free)
+ oop
+ inheritance (single)
+ "free" initializes NO vars
+ always mutable
+ Used in specific circumstances
+ The ViewModel in MVVM is always a class (also, UIKit (old style ios) is class-based)
private(set) self can modify, but anyone can see

use mutating func when the function changes the class itself
call init are mutatin, so you don't have to say mutating before init.
objectWillChange.send() will tell the UI(View) that the model is going to change.
@ObservedObject says that viewModel has a observable object. everytime the .send(), it redraws. SwiftUI is intelligent enough to tell what exactly has changed, so don't worry about efficiency.(Because cards are identifiable ...)

### Protocol
a stripped down class, has var and functions, but have no implementation.(and storage)
similar to the virtual class.
can inheritance

### property obsevers
essentially a way to execute code when the var changes
** completely unrelated to computed vars **
to use temporary value, use @State var ...: someType (the var is stored in heap), the address is fixed,so it's kept after the view redraws

use extension keyword to implement protocals
** Why Protocals? **
it's about how data structures in our application function.
Even when we talk about vars in the context of protocals, we don't define how they're stored. We only focus on the functionality and hide the implementation details behind it.
It's the promise of encapsulation from OOP but to a higher level.

### enum
An discrete data type

### Generics
Example of a user of a "don't care" type: array
```swift
struct Array<Element> {
    ...
    func append(_ element: Element) {...}
}
var a = Array<int>() 
a.append(5);a.append(22)
// can have mutiple "don't cares"(type parameter), like <Element, Foo>
```
### Property Wrappers
property wrappers are basically structs. (syntactic sugar)
```swift
@published var emojiArt: EmojiArt = EmojiArt()
... is really just this struct ...
struct published {
    var wrappedValue: EmojiArt
    var projectedValue: Publisher<EmojiArt, Never>
}
```
... and Swift (approximately) makes these vars available to you ...
```swift
var _emojiArt: Published = Published(wrappedValue: EmojiArt())
var emojiArt: EmojiArt {
    get { _emojiArt.wrappedValue }
    set { _emojiArt.wrappedValue = newValue}
}
```
can access projectedValue by asking $emojiArt
#### @Published
It publishes the change through its projectedValue ($emojiArt) which is a publisher.
It also invokes objectWillChange.send() in its enclosing ObservableObject.

#### @State
stores the wrappedValue in the heap; when it changes, invalidates the View.
Projected value (i.e. $): a Binding (to that value in the heap)

### @ObservedObject
wrappedValue: anything that implements the ObservableObject protocol (ViewModels)
what it does: invalidates the View when wrappedValue does objectWillChange.send().
Projected value

#### Bindings
one piece of source of truth

#### @EnvironmentObject
same as @ObservedObject, put passed to a view in a different way ...
wrappedValue: ObservableObject obtained via .environmentObject() sent to the View.
What is does: invalidates the View when wrappedValue does objectWillChange.send()
Projected value: a Binding (to the vars of the wrappedValue(a ViewModel)).

