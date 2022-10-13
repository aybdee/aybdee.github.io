function StringChallenge(str) {
  let tags = {
    "<b>": "</b>",
    "<i>": "</i>",
    "<em>": "</em>",
    "<div>": "</div>",
    "<p>": "</p>"
  }

}

function get_in(str, search_str, rev = true) {
  let get_str = ''
  for (i = rev ? 0 : str.length; rev ? i < str.length : i > 0; i += rev ? search_str.length : -search_str.length) {
    let curr_str = str.slice(rev ? i : i - search_str.length, rev ? i + search_str.length : i)
    if (curr_str == search_str) {
      if (rev) {
        return get_str + search_str
      } else {
        //reverse string
        return search_str + get_str.split('').reduce((reversed, char) => {
          return char + reversed;
        }, '');
      }
    } else {
      get_str += curr_str
    }
  }
  return ''
}

console.log(get_in("</abundance>", "</", false))

/*
<div>


</div>

at the beginning of a string 
check if <
go to the closing >

at the end check if 
>
go to the opening 
</
*/

