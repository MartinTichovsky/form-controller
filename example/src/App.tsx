import React from "react";
import { Content, Menu } from "./App.styles";
import { menuItemsWithKey } from "./menu-items";

const getHash = () => {
  if (window.location.hash) {
    return window.location.hash.substr(1);
  }
  return "";
};

const getRender = (key: string) => {
  const item = Object.values(menuItemsWithKey)
    .flat()
    .find((item) => item.key === key);
  return item?.render();
};

export const App = () => {
  const [selectedKey, setSelectedKey] = React.useState(
    getHash() || menuItemsWithKey["About Examples"][0].key
  );

  return (
    <>
      <Menu>
        <ul>
          {Object.keys(menuItemsWithKey).map((key, index) => {
            return (
              <React.Fragment key={index}>
                <li className="section">{key}</li>
                {menuItemsWithKey[key as keyof typeof menuItemsWithKey].map(
                  (item, index) => {
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
                  }
                )}
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
