import React from 'react';
import { Menu, Container, Button } from 'semantic-ui-react';
import { Link } from '../routes';

export default () => {
  return (
    <Menu borderless>
      <Container>
        <Link route="/">
          <Menu.Item>ArtRequest</Menu.Item>
        </Link>
        <Menu.Item position="right">
          <Link route="/requests/new">
            <Button
              content="Create Request"
              icon="add circle"
              primary
            />
          </Link>
        </Menu.Item>
      </Container>
    </Menu>
  );
};
