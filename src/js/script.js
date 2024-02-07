// this below does not work on firefox but on all other browsers.
// import json from '../json/languages.json' assert { type: 'json' };
// const languageArray = json;

const languageArray = await(await fetch("./json/languages.json")).json();

const language_list = document.getElementById("language-list");
languageArray.sort((a, b) => a.name.localeCompare(b.name));

/**
 * A function that inverts an Color and returns the inverted hexcode
 * in this case it is special and therefor the returned hexcode
 * is either black(#000000) or white(#FFFFFF)
 * @see https://stackoverflow.com/a/35970186
 * @param {*} hex
 * @returns
 */
function invertColor(hex) {
  if (hex.indexOf("#") === 0) {
    hex = hex.slice(1);
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error("Invalid HEX color.");
  }
  const r = parseInt(hex.slice(0, 2), 16),
    g = parseInt(hex.slice(2, 4), 16),
    b = parseInt(hex.slice(4, 6), 16);
  // https://stackoverflow.com/a/3943023/112731
  // slightly moddified for better look on some colours
  return r * 0.299 + g * 0.587 + b * 0.114 > 150 ? "#000000" : "#FFFFFF";
}

/**
 * Creating a normal card
 * @param {Object[]} e
 */
const createRegister = (e) => {
  const language = document.createElement("li");
  let title_bg,
    title_fg,
    extensions = "",
    filenames = "",
    interpreters = "";
  if (e.color != undefined) {
    title_bg = e.color;
    title_fg = invertColor(e.color);
  } else {
    title_bg = "#CCC";
    title_fg = "#000";
  }

  if (e.extensions != undefined) {
    e.extensions.forEach((e) => {
      extensions += `<code>${e}</code> `;
    });
  } else {
    extensions += "No extensions.";
  }

  if (e.filenames != undefined) {
    e.filenames.forEach((e) => {
      filenames += `<code>${e}</code> `;
    });
  } else {
    filenames += "No files.";
  }

  if (e.interpreters != undefined) {
    e.interpreters.forEach((e) => {
      interpreters += `<code>${e}</code> `;
    });
  } else {
    interpreters += "No Interpreters.";
  }

  const link = `https://github.com/topics/${e.name
    .replaceAll("++", "pp")
    .replaceAll("#", "sharp")
    .replaceAll("*", "star")}`;

  language.innerHTML = `<h1 class="language-header" style="color: ${title_fg}; background-color: ${title_bg};" ><a target="_blank" href="${link}">${e.name}</a></h1><table class="language-table"><tbody><tr><td>Hexcode</td><td><code>${title_bg}</code></td></tr><tr><td>Type</td><td><code>${e.type}</code></td></tr><tr><td>Extensions</td><td>${extensions}</td></tr><tr><td>Filenames</td><td>${filenames}</td></tr><tr><td>Interpreters</td><td>${interpreters}</td></tr></tbody></table>`;
  language.className = "language-entry";
  language_list.appendChild(language);
};

languageArray.forEach((e) => {
  createRegister(e);
});

const filter_extension = (v, e) => {
  let fe = [];
  if (v.extensions != undefined) {
    fe = v.extensions.filter((f) => f.indexOf(e) >= 0);
    fe = fe.sort((a, b) => a - b);
  }
  return fe.at(0) == undefined ? -1 : fe.at(0).indexOf(e);
}

const filter_file = (v, f) => {
  let ff = [];
  if (v.filenames != undefined) {
    ff = v.filenames.filter((e) => e.indexOf(f) >= 0);
    ff = ff.sort((a, b) => a - b);
  }
  return ff.at(0) == undefined ? -1 : ff.at(0).indexOf(f);
}

// Adding the event listener to the input
document
  .getElementById("gh-colors-searchfield")
  .addEventListener("input", (e) => {
    // Clearing out the list
    language_list.innerHTML = "";
    // Getting the value of what is written in the field
    const st2 = e.target.value;

    const string_array = st2.split(":");
    switch (string_array.at(0)) {
      case "extension": {
        const ex = string_array.at(1);
        const filteredArray = languageArray.filter((v) => filter_extension(v, ex) >= 0);

        const mappedArray = filteredArray.map((value, index) => {
          const position = filter_extension(value, ex);
          const name = value.name;
          return { name, index, position };
        });

        mappedArray.sort((a, b) => a.position - b.position);

        mappedArray.forEach((e) => {
          createRegister(filteredArray[e.index]);
        });
      } break;

      case "type": {
        const t = string_array.at(1);
        const filteredArray = languageArray.filter((v) => v.type.indexOf(t) >= 0);

        const mappedArray = filteredArray.map((value, index) => {
          const position =  value.type.indexOf(t);
          const name = value.name;
          return { name, index, position };
        });

        mappedArray.forEach((e) => {
          createRegister(filteredArray[e.index]);
        });
      } break;

      case "file": {
        const fn = string_array.at(1);
        const filteredArray = languageArray.filter((v) => filter_file(v, fn) >= 0);

        const mappedArray = filteredArray.map((value, index) => {
          const position = filter_file(value, fn);
          const name = value.name;
          return { name, index, position };
        });

        mappedArray.sort((a, b) => a.position - b.position);

        mappedArray.forEach((e) => {
          createRegister(filteredArray[e.index]);
        });
      } break;

      default: {
        const filteredArray = languageArray.filter((v) => v.name.indexOf(st2) >= 0);

        const mappedArray = filteredArray.map((value, index) => {
          const position = value.name.indexOf(st2);
          const name = value.name;
          return { name, index, position };
        });

        mappedArray.sort((a, b) => a.position - b.position);

        mappedArray.forEach((e) => {
          createRegister(filteredArray[e.index]);
        });
      } break;
    }
  });
