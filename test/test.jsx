/**
  Cherry picked tests from Preact

  The MIT License (MIT)
  Copyright (c) 2015-present Jason Miller

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
 */
import { expect } from '@esm-bundle/chai';
import { h, Fragment, render } from '../little-vdom.js';
import { clearLog, getLog, logCall } from './_util/logCall.js';
import { setupScratch, teardown, serializeHtml } from './_util/helpers.js';

describe('all', () => {
  let scratch;

  let resetAppendChild;
  let resetInsertBefore;
  let resetRemoveChild;
  let resetRemove;

  beforeEach(() => {
    scratch = setupScratch();
  });

  afterEach(() => {
    teardown(scratch);
  });

  before(() => {
    resetAppendChild = logCall(Element.prototype, 'appendChild');
    resetInsertBefore = logCall(Element.prototype, 'insertBefore');
    resetRemoveChild = logCall(Element.prototype, 'removeChild');
    resetRemove = logCall(Element.prototype, 'remove');
  });

  after(() => {
    resetAppendChild();
    resetInsertBefore();
    resetRemoveChild();
    resetRemove();
  });

  /** @type {(props: {values: any[]}) => any} */
  const List = props => (
    <ol>
      {props.values.map(value => (
        <li key={value}>{value}</li>
      ))}
    </ol>
  );

  /**
   * Move an element in an array from one index to another
   * @param {any[]} values The array of values
   * @param {number} from The index to move from
   * @param {number} to The index to move to
   */
  function move(values, from, to) {
    const value = values[from];
    values.splice(from, 1);
    values.splice(to, 0, value);
  }


  it('should register on* functions as handlers', () => {
    let count = 0;
    let onclick = () => (++count);

    render(<div onClick={onclick} />, scratch);
    expect(scratch.childNodes[0].attributes.length).to.equal(0);
    scratch.childNodes[0].click();
    expect(count).to.equal(1);
  });

  // render.test.js

  it('should rerender when value from "" to 0', () => {
    render('', scratch);
    expect(scratch.innerHTML).to.equal('');

    render(0, scratch);
    expect(scratch.innerHTML).to.equal('0');
  });

  it('change content', () => {
    render(<div>Bad</div>, scratch);
    render(<div>Good</div>, scratch);
    expect(scratch.innerHTML).to.eql(`<div>Good</div>`);
  });

  it('should allow node type change with content', () => {
    render(<span>Bad</span>, scratch);
    render(<div>Good</div>, scratch);
    expect(scratch.innerHTML).to.eql(`<div>Good</div>`);
  });

  it('should nest empty nodes', () => {
    render(
      <div>
        <span />
        <foo />
        <x-bar />
      </div>,
      scratch
    );

    expect(scratch.childNodes).to.have.length(1);
    expect(scratch.childNodes[0].nodeName).to.equal('DIV');

    let c = scratch.childNodes[0].childNodes;
    expect(c).to.have.length(3);
    expect(c[0].nodeName).to.equal('SPAN');
    expect(c[1].nodeName).to.equal('FOO');
    expect(c[2].nodeName).to.equal('X-BAR');
  });

  it('should reorder child pairs', () => {
    render(
      <div>
        <a>a</a>
        <b>b</b>
      </div>,
      scratch
    );

    let a = scratch.firstChild.firstChild;
    let b = scratch.firstChild.lastChild;

    expect(a).to.have.property('nodeName', 'A');
    expect(b).to.have.property('nodeName', 'B');

    render(
      <div>
        <b>b</b>
        <a>a</a>
      </div>,
      scratch
    );

    expect(scratch.firstChild.firstChild).to.equal(b);
    expect(scratch.firstChild.lastChild).to.equal(a);
  });

  it('should remove class attributes', () => {
    const App = props => (
      <div class={props.class}>
        <span>Bye</span>
      </div>
    );

    render(<App class="hi" />, scratch);
    expect(scratch.innerHTML).to.equal(
      '<div class="hi"><span>Bye</span></div>'
    );

    render(<App />, scratch);
    expect(scratch.innerHTML).to.equal('<div><span>Bye</span></div>');
  });

  // keys.test.js

  it('should remove orphaned keyed nodes', () => {
    render(
      <div>
        <div>1</div>
        <li key="a">a</li>
        <li key="b">b</li>
      </div>,
      scratch
    );

    render(
      <div>
        <div>2</div>
        <li key="b">b</li>
        <li key="c">c</li>
      </div>,
      scratch
    );

    expect(scratch.innerHTML).to.equal(
      '<div><div>2</div><li>b</li><li>c</li></div>'
    );
  });

  it('should append new keyed elements', () => {
    const values = ['a', 'b'];

    render(<List values={values} />, scratch);
    expect(scratch.textContent).to.equal('ab');

    values.push('c');
    clearLog();

    render(<List values={values} />, scratch);
    expect(scratch.textContent).to.equal('abc');
    expect(getLog()).to.deep.equal([
      '<li>.insertBefore(#text, Null)',
      '<ol>ab.insertBefore(<li>c, Null)'
    ]);
  });

  it('should remove keyed elements from the end', () => {
    const values = ['a', 'b', 'c', 'd'];

    render(<List values={values} />, scratch);
    expect(scratch.textContent).to.equal('abcd');

    values.pop();
    clearLog();

    render(<List values={values} />, scratch);
    expect(scratch.textContent).to.equal('abc');
    expect(getLog()).to.deep.equal(['<li>d.remove()']);
  });

  it('should prepend keyed elements to the beginning', () => {
    const values = ['b', 'c'];

    render(<List values={values} />, scratch);
    expect(scratch.textContent).to.equal('bc');

    values.unshift('a');
    clearLog();

    render(<List values={values} />, scratch);
    expect(scratch.textContent).to.equal('abc');

    // Comment out efficient reconciliation proof, would require a bigger diffing algo.
    // expect(getLog()).to.deep.equal([
    //   '<li>.insertBefore(#text, Null)',
    //   '<ol>bc.insertBefore(<li>a, <li>b)'
    // ]);
  });

  it('should remove keyed elements from the beginning', () => {
    const values = ['z', 'a', 'b', 'c'];

    render(<List values={values} />, scratch);
    expect(scratch.textContent).to.equal('zabc');

    values.shift();
    clearLog();

    render(<List values={values} />, scratch);
    expect(scratch.textContent).to.equal('abc');

    // Comment out efficient reconciliation proof, would require a bigger diffing algo.
    // expect(getLog()).to.deep.equal(['<li>z.remove()']);
  });

  it('should insert new keyed children in the middle', () => {
    const values = ['a', 'c'];

    render(<List values={values} />, scratch);
    expect(scratch.textContent).to.equal('ac');

    values.splice(1, 0, 'b');
    clearLog();

    render(<List values={values} />, scratch);
    expect(scratch.textContent).to.equal('abc');
    // expect(getLog()).to.deep.equal([
    //   '<li>.insertBefore(#text, Null)',
    //   '<ol>ac.insertBefore(<li>b, <li>c)'
    // ]);
  });

  it('should remove keyed children from the middle', () => {
    const values = ['a', 'b', 'x', 'y', 'z', 'c', 'd'];

    render(<List values={values} />, scratch);
    expect(scratch.textContent).to.equal('abxyzcd');

    values.splice(2, 3);
    clearLog();

    render(<List values={values} />, scratch);
    expect(scratch.textContent).to.equal('abcd');
    // expect(getLog()).to.deep.equal([
    //   '<li>z.remove()',
    //   '<li>y.remove()',
    //   '<li>x.remove()'
    // ]);
  });

  it('should move keyed children to the end of the list', () => {
    const values = ['a', 'b', 'c', 'd'];

    render(<List values={values} />, scratch);
    expect(scratch.textContent).to.equal('abcd');

    // move to end
    move(values, 0, values.length - 1);
    clearLog();

    render(<List values={values} />, scratch);
    expect(scratch.textContent).to.equal('bcda', 'move to end');
    // expect(getLog()).to.deep.equal(
    //   ['<ol>abcd.insertBefore(<li>a, Null)'],
    //   'move to end'
    // );

    // move to beginning
    move(values, values.length - 1, 0);
    clearLog();

    render(<List values={values} />, scratch);
    expect(scratch.textContent).to.equal('abcd', 'move to beginning');
    // expect(getLog()).to.deep.equal(
    //   ['<ol>bcda.insertBefore(<li>a, <li>b)'],
    //   'move to beginning'
    // );
  });

  it('should reverse keyed children effectively', () => {
    const values = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];

    render(<List values={values} />, scratch);
    expect(scratch.textContent).to.equal(values.join(''));

    // reverse list
    values.reverse();
    clearLog();

    render(<List values={values} />, scratch);
    expect(scratch.textContent).to.equal(values.join(''));
    // expect(getLog()).to.deep.equal([
    //   '<ol>abcdefghij.insertBefore(<li>j, <li>a)',
    //   '<ol>jabcdefghi.insertBefore(<li>i, <li>a)',
    //   '<ol>jiabcdefgh.insertBefore(<li>h, <li>a)',
    //   '<ol>jihabcdefg.insertBefore(<li>g, <li>a)',
    //   '<ol>jihgabcdef.insertBefore(<li>f, <li>a)',
    //   '<ol>jihgfabcde.insertBefore(<li>e, <li>a)',
    //   '<ol>jihgfeabcd.insertBefore(<li>d, <li>a)',
    //   '<ol>jihgfedabc.insertBefore(<li>c, <li>a)',
    //   '<ol>jihgfedcab.insertBefore(<li>a, Null)'
    // ]);
  });

  // fragment.test.js

  it('should render a single child', () => {
    clearLog();
    render(
      <Fragment>
        <span>foo</span>
      </Fragment>,
      scratch
    );

    expect(scratch.innerHTML).to.equal('<span>foo</span>');
    expect(getLog()).to.deep.equal([
      '<span>.insertBefore(#text, Null)',
      '<div>.insertBefore(<span>foo, Null)'
    ]);
  });

  it('should render multiple children via noop renderer', () => {
    render(
      <Fragment>
        hello <span>world</span>
      </Fragment>,
      scratch
    );

    expect(scratch.innerHTML).to.equal('hello <span>world</span>');
  });

  it.skip('should handle reordering components that return Fragments #1325', () => {
    const X = (props) => {
      return props.children;
    }

    const App = (props) => {
      if (props.i === 0) {
        return (
          <div>
            <X key={1}>1</X>
            <X key={2}>2</X>
          </div>
        );
      }
      return (
        <div>
          <X key={2}>2</X>
          <X key={1}>1</X>
        </div>
      );
    }

    render(<App i={0} />, scratch);
    expect(scratch.textContent).to.equal('12');

    clearLog();
    console.log('----------------------------------');

    render(<App i={1} />, scratch);
    console.log(getLog());
    expect(scratch.textContent).to.equal('21');
  });

  // refs.test.js

  it('should support createRef', () => {
    const r = { current: null };
    expect(r.current).to.equal(null);

    render(<div ref={r} />, scratch);
    expect(r.current).to.equal(scratch.firstChild);
  });

  // createRoot.js

  it('should apply string attributes', () => {
    render(<div foo="bar" data-foo="databar" />, scratch);
    expect(serializeHtml(scratch)).to.equal(
      '<div data-foo="databar" foo="bar"></div>'
    );
  });

  it('should apply class as String', () => {
    render(<div class="foo" />, scratch);
    expect(scratch.childNodes[0]).to.have.property('className', 'foo');
  });

  it('should set checked attribute on custom elements without checked property', () => {
    render(<o-checkbox checked />, scratch);
    expect(scratch.innerHTML).to.equal(
      '<o-checkbox checked="true"></o-checkbox>'
    );
  });

  it('should set value attribute on custom elements without value property', () => {
    render(<o-input value="test" />, scratch);
    expect(scratch.innerHTML).to.equal('<o-input value="test"></o-input>');
  });

  it('should mask value on password input elements', () => {
    render(<input value="xyz" type="password" />, scratch);
    expect(scratch.innerHTML).to.equal('<input type="password">');
  });


});
