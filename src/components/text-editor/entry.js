import Quill from 'quill/core';

import Toolbar from 'quill/modules/toolbar';
import Snow from 'quill/themes/snow';

import Bold from 'quill/formats/bold';
import Italic from 'quill/formats/italic';
import Underline from 'quill/formats/underline';
import Header from 'quill/formats/header';
import Code from 'quill/formats/code';
import BlockQuote from 'quill/formats/blockquote';
import Link from 'quill/formats/link'

import List, { ListItem } from 'quill/formats/list';

Quill.register({
    "modules/toolbar": Toolbar,
    "themes/snow": Snow,
    "formats/bold": Bold,
    "formats/underline": Underline,
    "formats/italic": Italic,
    "formats/header": Header,
    "formats/link": Link,
    "formats/code": Code,
    "formats/blockquote": BlockQuote,
    "formats/list": ListItem
});

export default Quill;