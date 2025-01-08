+++
title = "Building Evo Part 2"
draft=false
date = "2025-01-07T05:57:12+01:00"
author = "abundance"
authorTwitter = "aybdee" #do not include @
cover = ""
tags = ["rust","simulation","sdl2"]
keywords = []
description = ""
showFullContent = false
readingTime = false
hideComments = false
+++

On todays' episode of building evo, i'm going over the basic sdl2 implementation, Hopefully you've read the first [post](https://aybdee.xyz/posts/evo_part_1/) and you know what evo is, and you also know that i moved from using sdl2 to bevy. This post is just going over what i was able to do before switching because i think that might be interesting to read.

That said, I didn't really go far with using sdl2. I implemented basic graphics and a view for the organisms, organism tracking within the environment, and wall stacking (ONLY for organisms going in the same direction). Getting organisms to stack on walls was a real pain, it took more than a month(including procrastination time) to figure out, or maybe it's a skill issue.

## Basic Setup

First thing to look at is my window and running loop setup, if you're not really familiar with using sdl2 and this doesn't really make sense, you can look at [this](https://wiki.libsdl.org/SDL2/Tutorials). It's a really nice resource that can hopefully help.

```rust
use std::thread::sleep;
use std::time::Duration;

use graphics::Renderer;
use sdl2::event::Event;
use sdl2::keyboard::Keycode;
use sdl2::pixels::Color;
use sdl2::rect::Point;

const SCREEN_WIDTH: u32 = 800; //num columns(x)
const SCREEN_HEIGHT: u32 = 600; //num rows(y)
const FPS: u64 = 8;

pub fn main() -> Result<(), String> {
    let sdl_context = sdl2::init()?;
    let video_subsystem = sdl_context.video()?;

    let window = video_subsystem
        .window("Evo - natural selection", SCREEN_WIDTH, SCREEN_HEIGHT)
        .opengl()
        .build()
        .map_err(|e| e.to_string())?;

    let mut event_pump = sdl_context.event_pump()?;
    let point_size = 5;
    let mut renderer = Renderer::new(window, point_size)?;

    'running: loop {
        for event in event_pump.poll_iter() {
            match event {
                Event::Quit { .. }
                | Event::KeyDown {
                    keycode: Some(Keycode::Escape),
                    ..
                } => break 'running,

                _ => {}
            }
        }

        sleep(Duration::from_millis(32));
    }
    Ok(())
}

```

I dont think there's too much to talk about here, i'm using the rust_sdl2 crate with the opengl backend for rendering. I setup some constants for the whole rendering process. Also, I kept mixing up the rows,columns and x-y coordinates throughout the code(I think i'm window dyslexic). So I had to literally comment "WIDTH means number of columns that means x" so i wouldn't forget. for now the running loop is just sleeping till you press the escape key then it quits. One weird thing i randomly noticed though is that if you dont put a sleep in the running loop then it crashes instead of closing, this probably happens because we're not giving sdl2 enough time to process events properly(i'm just speculating, couldn't really find any resources on this)

## Environment and Organism Representation

The environment is basically a 2-dimensional grid where each cell in the grid can only hold one organism and organisms are represented with the **Organism** struct that stores the colour and cell index for the organism. I'm also keeping a map of each organism to it's index, I thought having the Grid work with just indices instead of storing the organisms directly in the grid was better because it allowed for a nicer seperation of concerns and I felt that the Organism struct would only get more and more complex. I didn't want a situation where i'd have to keep changing the grid implementation

```rust
#[derive(Debug)]
pub struct State {
    pub grid: Grid,
    pub organisms: HashMap<u32, Organism>,
    pub ids: Vec<u32>,
}

#[derive(Debug, Clone)]
pub struct Organism {
    pub position: CellIndex,
    pub color: Color,
}

```

**Grid** is a custom grid type i implemented to make stuff easier, I implemented display for it to make debugging a bit easier. I also added some utilities that i thought would be helpful.

```rust
#[derive(Debug, Clone)]
pub struct Grid {
    pub cells: Vec<Vec<Cell>>,
    pub num_rows: usize,
    pub num_cols: usize,
}

#[derive(Clone, Debug)]
pub struct Cell {
    pub value: u32,
}

impl fmt::Display for Grid {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let grid_display: String = self
            .cells
            .iter()
            .map(|x| {
                let row: String = x
                    .iter()
                    .map(|cell| (cell.value).to_string() + " ")
                    .collect();
                format!("{row} \n")
            })
            .collect();
        write!(f, "{grid_display}")
    }
}

impl Grid {
    pub fn new(row_size: usize, column_size: usize) -> Self {...}
    pub fn reset(&mut self) {...}
    pub fn get(&self, index: CellIndex) -> Cell {...}
    pub fn set_cell(&mut self, index: CellIndex, id: u32) {...}
    pub fn unset_cell(&mut self, index: CellIndex) {...}
    pub fn set_cells(&mut self, updates: Vec<(CellIndex, u32)>) {...}
    pub fn unset_cells(&mut self, cells: Vec<CellIndex>) {...}
    pub fn shape(&self) -> (usize, usize) {...}
    pub fn is_set(&self, index: CellIndex) -> bool {...}
    pub fn num_set(&self) -> usize {...}
}
```

## Rendering

I'm drawing everything for this on an SDL2 canvas, because i googled how to draw rectangles in sdl2 and that was what came up. I think there are other ways to do this, off the top of my head you could also use a texture, and i think that's actually more performant because textures are stored and processed on the GPU. To make the drawing process a bit easier I made a nice Renderer struct to just abstract over the basic drawing functionalities you'd need. it takes a WindowCanvas and a point size variable which represents the size of individual points on the canvas(a point in the canvas corresponds to an organism so the point size just corresponds to the size of each organism on screen). In retrospect i wonder why i passed an owned WindowCanvas instead of a mutable reference, probably to avoid working with lifetimes. (I'm lazy like that).

```rust
pub struct Renderer {
    pub canvas: WindowCanvas,
    pub point_size: u32,
}

pub fn new(window: Window, point_size: u32) -> Result<Self, String> {...}
pub fn draw_dot(&mut self, point: Point, color: Color) -> Result<(), String> {...}
pub fn draw_rect(
    &mut self,
    point: Point,
    width: u32,
    height: u32,
    color: Color,
) -> Result<(), String> {...}
pub fn get_size(&self) -> (u32, u32) {...}
pub fn clear(&mut self) {...}
pub fn present(&mut self) {...}
fn get_rect(&self, rect_width: u32, rect_height: u32, x: i32, y: i32) -> Rect {...}
pub fn render_text(&mut self, text: &str, font: Font, position: Point) -> Result<(), String> {...}
```

By the way, rendering text on sdl2 is honestly really annoying to do(one of the reasons why i switched to using bevy), here's the render_text function for context

```rust
pub fn render_text(&mut self, text: &str, font: Font, position: Point) -> Result<(), String> {
    let texture_creator = self.canvas.texture_creator();
    let surface = font
        .render(&text)
        .blended(Color::RGBA(255, 0, 0, 255))
        .map_err(|e| e.to_string())?;
    let texture = texture_creator
        .create_texture_from_surface(&surface)
        .map_err(|e| e.to_string())?;

    let TextureQuery { width, height, .. } = texture.query();

    // If the text is too big for the screen, downscale it (and center regardless)
    let padding = 64;
    let target = self.get_rect(width, height, position.x(), position.y());

    self.canvas.copy(&texture, None, Some(target))?;

    return Ok(());
}
```

What do you mean there's no write function that just puts the text on the screen, are we in the stone ages ?

Anyways, I pass a reference to the **Renderer** into **State** like so.

```rust
#[derive(Debug)]
pub struct State<'a> {
    ...
    pub renderer: Option<&'a mut Renderer>,
}
```

In Retrospect, I feel like I could have handled that a bit better because conceptually, the renderer isn't really attached to the state in any meaningful way, it just feels like baggage on the type. I guess at the time it was probably the easiest thing to do
something else i could have done is maybe pass the renderer as an argument to a draw function in the struct, something like this

```rust
impl State{
    pub fn draw(renderer: &mut Renderer)...
}
```

weirdly enough i have a really similar function already implemented in the struct called display so i wonder why that didn't come to mind.

```rust
impl State{
    pub fn display(&mut self) -> Result<(), String> {
        //check to see if renderer is attached
        let mut rng = rand::thread_rng();
        match &mut self.renderer {
            Some(renderer) => {
                renderer.clear();
                for organism_entry in self.organisms.iter() {
                    let (x, y) = organism_entry.1.position;
                    renderer.draw_dot(Point::new(x as i32, y as i32), organism_entry.1.color)?;
                }
                renderer.present();
                Ok(())
            }
            None => Err(String::from("renderer not attached")),
        }

    }
    pub fn clear_display(&mut self) -> Result<(), String> {...}
}
```

## Updated Running Loop

I updated the running loop to re-render the organisms on each iteration like so

```rust
pub fn main() -> Result<(), String> {
    ...
    'running: loop {
        ...
        environment.display()?;
        sleep(Duration::from_millis(32));
    }
    ...
}
```

I think i'll stop here for now, don't want to make this too long

Till next time.

Authors Note - I mixed up the rows and columns while i was writing this 😭, i need help.
