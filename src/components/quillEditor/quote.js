import Block from "quill/blots/block";
import Break from "quill/blots/break";
import Cursor from "quill/blots/cursor";
import Inline from "quill/blots/inline";
import TextBlot from "quill/blots/text";
import Container from "quill/blots/container";
import Quill from "quill/core/quill";

class QuoteBlockContainer extends Container {
  static create(value) {
    const domNode = super.create(value);
    domNode.setAttribute("spellcheck", false);
    return domNode;
  }

  html(index, length) {
    const text = this.children
      .map(child => child.domNode.innerText)
      .join("\n")
      .slice(index, index + length);
    return `<p>${text}</p>`;
  }
}

class QuoteBlock extends Block {
  static register() {
    Quill.register(QuoteBlockContainer);
  }
}

class Quote extends Inline {}
Quote.blotName = "p";
Quote.tagName = "p";

QuoteBlock.blotName = "quote-block";
QuoteBlock.className = "quote";
QuoteBlock.tagName = "DIV";

QuoteBlockContainer.blotName = "block-quote";
QuoteBlockContainer.className = "ql-quote";
QuoteBlockContainer.tagName = "block-quote";

QuoteBlockContainer.allowedChildren = [QuoteBlock];
QuoteBlock.allowedChildren = [TextBlot, Break, Cursor, Block];
QuoteBlock.requiredContainer = QuoteBlockContainer;
QuoteBlock.TAB = "  ";

export { Quote, QuoteBlockContainer, QuoteBlock as default };
