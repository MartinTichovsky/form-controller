import React from "react";
import { Content, Menu } from "./App.styles";
import { menuItems } from "./menu-items";

const getHash = () => {
  if (window.location.hash) {
    return window.location.hash.substr(1);
  }
  return "";
};

const getRender = (key: string) => {
  const item = Object.values(menuItems)
    .flat()
    .find((item) => item.key === key);
  return item?.render();
};

export const App = () => {
  const [selectedKey, setSelectedKey] = React.useState(
    getHash() || menuItems["Text Fields"][0].key
  );

  return (
    <>
      <Menu>
        <ul>
          {Object.keys(menuItems).map((key, index) => {
            return (
              <React.Fragment key={index}>
                <li className="section">{key}</li>
                {menuItems[key as keyof typeof menuItems].map((item, index) => {
                  return (
                    <li className="menu-item" key={index}>
                      <a
                        className={selectedKey === item.key ? "selected" : ""}
                        href={`#${item.key}`}
                        onClick={() => setSelectedKey(item.key)}
                      >
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </React.Fragment>
            );
          })}
        </ul>
      </Menu>
      <Content>
        <div>{getRender(selectedKey)}</div>
      </Content>
    </>
  );
};
