import { format, parse } from "date-fns";

export function randomId(num) {
  return Math.random()
    .toString(32)
    .substr(num);
}

export function formatDate(date, string) {
  const parsedDate = parse(date);
  return format(parsedDate, string || "dddd, MMMM Do, YYYY");
}

function getInputSelection(el) {
  let start = 0,
    end = 0,
    normalizedValue,
    range,
    textInputRange,
    length,
    endRange;

  let val = el.contenteditable ? el.innerHTML : el.value;

  if (
    "selectionStart" in el &&
    typeof el.selectionStart === "number" &&
    typeof el.selectionEnd === "number"
  ) {
    start = el.selectionStart;
    end = el.selectionEnd;
  } else {
    range = document.selection.createRange();

    if (range && range.parentElement() === el) {
      length = val.length;
      normalizedValue = val.replace(/\r\n/g, "\n");

      textInputRange = el.createTextRange();
      textInputRange.moveToBookmark(range.getBookmark());

      endRange = el.creatTextRange();
      endRange.collapse(false);

      if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
        start = end = length;
      } else {
        start = -textInputRange.moveStart("character", -length);
        start += normalizedValue.slice(0, start).split("\n").length - 1;

        if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
          end = length;
        } else {
          end = -textInputRange.moveEnd("character", -length);
          end += normalizedValue.slice(0, end).split("\n").length - 1;
        }
      }
    }
  }
  return {
    start: start,
    end: end
  };
}

export function getCaretPosition(el) {
  let caretPos = 0, sel, range;
  if (window.getSelection) {
    sel = window.getSelection();
    if (sel.rangeCount) {
      range = sel.getRangeAt(0);
      if (range.commonAncestorContainer.parentNode === el) {
        caretPos = range.endOffset;
      }
    }
  } else if (document.selection && document.selection.createRange) {
    range = document.selection.createRange();
    if (range.parentElement() === el) {
      let tempEl = document.createElement("span");
      el.insertBefore(tempEl, el.firstChild);
      let tempRange = range.duplicate();
      tempRange.moveToElementText(tempEl);
      tempRange.setEndPoint("EndToEnd", range);
      caretPos = tempRange.text.length;
    }
  }
  return caretPos;
}

export function formatText(el, text) {
  el.focus();
  const target = document.activeElement;
  const sel = getInputSelection(el);
  if (!target.classList.contains("comment-content")) return;
  return val.split(0, sel.start) + text + val.split(sel.end);
}
