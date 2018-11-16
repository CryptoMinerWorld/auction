import React from 'react';
import Globe from '../../../app/images/dashboard/Land.png';

const MapPageDetails = () => (
  <article className="pa3 mw9 center">
    <h1 className="tc white ttu">Info about buying/owning a country</h1>
    <div className="flex row-ns col jcc">
      <p className="measure-wide">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
        been the industry standard dummy text ever since the 1500s, when an unknown printer took a
        galley of type and scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
        It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
        passages, and more recently with desktop publishing software like Aldus PageMaker including
        versions of Lorem Ipsum.
      </p>
      <img src={Globe} alt="" className="w-auto h-100 ma3" />
    </div>
    <div className="flex row-ns flex-column-reverse jcc">
      <img src={Globe} alt="" className="w-auto h-100 ma3" />
      <p className="measure-wide">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
        been the industry standard dummy text ever since the 1500s, when an unknown printer took a
        galley of type and scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
        It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
        passages, and more recently with desktop publishing software like Aldus PageMaker including
        versions of Lorem Ipsum.
      </p>
    </div>
  </article>
);

export default MapPageDetails;
