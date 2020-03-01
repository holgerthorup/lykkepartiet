import React, { Component } from 'react';
import FooterItem from '../footerItem';

class Footer extends Component {
  render() {
    return (
      <footer>
        <div className="max-w-xl mx-auto text-center pt-8 pb-4">
          <FooterItem
            linkAddress="https://lykkepartiet.dk"
            linkTarget="_lykkepartiet"
            iconName="Edit3"
            linkText="Giv en vælgererklæring"
          />
        </div>
      </footer>
    );
  }
}

export default Footer;
