"use strict";
import { exec } from "bis-pell";
export default (function() {
  return [
    {
      name: "bold",
      icon: '<i class="fa fa-bold"></i>',
      result: () => exec("bold", "<em>")
    },
    {
      name: "italic",
      icon: '<i class="fa fa-italic"></i>',
      result: () => exec("italic", "<i>")
    },
    {
      name: "underline",
      icon: '<i class="fa fa-underline"></i>',
      result: () => exec("underline", "<u>")
    },
    {
      name: "heading",
      icon: '<i class="fa fa-heading"></i>',
      result: () => exec("heading1", "<h1>")
    },
    {
      name: "code",
      icon: '<i class="fa fa-code"></i>',
      result: () => exec("codeblock", "<pre>")
    }
  ];
})();
