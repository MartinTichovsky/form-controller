import styled from "@emotion/styled";

export const Content = styled("div")({
  gridArea: "content",

  ".form-controller": {
    marginTop: 15,

    ".field-row": {
      marginTop: 15,

      ".input-field-error": {
        paddingLeft: 10
      }
    },

    ".info": {
      fontFamily: "Arial",
      fontSize: ".8em",
      fontWeight: "bolder",
      marginTop: 20,
      maxWidth: 300
    }
  }
});

export const Menu = styled("ul")({
  gridArea: "sidebar",
  margin: 0,
  padding: 0,

  li: {
    listStyle: "none",

    "&.menu-item": {
      marginLeft: 10,
      marginTop: 5,

      a: {
        color: "blue",
        textDecoration: "none",

        "&.selected": {
          textDecoration: "underline"
        },

        "&:hover": {
          textDecoration: "underline"
        }
      }
    },

    "&.section": {
      marginBottom: 10,
      textTransform: "uppercase",

      "&:not(:first-of-type)": {
        marginTop: 15
      }
    }
  }
});

export const Wrapper = styled("div")({
  display: "grid",
  gap: "20px",
  gridTemplateAreas: "'sidebar content'",
  gridTemplateColumns: "300px auto"
});
