import React from 'react';

const FAQ = () =>
  <div className="bg-off-black white ma0 pa3">
    <h2>Frequently Asked Questions</h2>
    <details open>
      <summary className="underlined blue">some question</summary>
      <p>Answer to that question.</p>
    </details>
    <details>
      <summary className="underlined blue">some question</summary>
      <p>Answer to that question.</p>
    </details>
    <details>
      <summary className="underlined blue">some question</summary>
      <p>Answer to that question.</p>
    </details>
    <details>
      <summary className="underlined blue">some question</summary>
      <p>Answer to that question.</p>
    </details>
  </div>

export default FAQ;
