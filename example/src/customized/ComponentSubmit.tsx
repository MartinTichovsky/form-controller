import React from "react";
import { Controller, FormController, Input, Submit } from "form-controller";
import { FormRow } from "../common-components";

type MyForm = {
  givenName: string;
  surname: string;
};

const FunctionalSubmitComponent = ({
  children,
  disabled,
  onClick
}: React.PropsWithChildren<{
  disabled: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => Controller<MyForm>;
}>) => {
  const [pending, setPending] = React.useState(false);
  const isMounted = React.useRef(true);

  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const controller = onClick(event);
    if (controller.isValid) {
      console.log(controller.fields);
      setPending(true);
      setTimeout(() => {
        if (isMounted.current) {
          setPending(false);
        }
      }, 2000);
    }
  };

  return (
    <button disabled={disabled} onClick={handleClick}>
      {pending ? "loading..." : children}
    </button>
  );
};

interface ClassSubmitComponentProps {
  disabled: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => Controller<MyForm>;
}

class ClassSubmitComponent extends React.Component<ClassSubmitComponentProps> {
  state: { pending: false } = { pending: false };
  private componentIsMounted;

  constructor(props: ClassSubmitComponentProps) {
    super(props);
    this.componentIsMounted = true;
  }

  componentWillUnmount() {
    this.componentIsMounted = false;
  }

  handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const controller = this.props.onClick(event);
    if (controller.isValid) {
      console.log(controller.fields);
      this.setState({ pending: true });
      setTimeout(() => {
        if (this.componentIsMounted) {
          this.setState({ pending: false });
        }
      }, 2000);
    }
  };

  render() {
    return (
      <button disabled={this.props.disabled} onClick={this.handleClick}>
        {this.state.pending ? "loading..." : this.props.children}
      </button>
    );
  }
}

export const ComponentSubmit = () => {
  const [counter, setCounter] = React.useState(0);

  return (
    <>
      <div>
        <button type="button" onClick={() => setCounter(counter + 1)}>
          Re-Render Form: {counter}
        </button>
      </div>
      <FormController<MyForm> style={{ marginTop: 15 }} validateOnChange>
        {(controller) => {
          return (
            <>
              <FormRow>
                <Input
                  controller={controller}
                  name="givenName"
                  placeholder="Input a given name"
                  validate={(value) =>
                    !value?.trim() && "Provide a valid given name"
                  }
                />
              </FormRow>
              <FormRow>
                <Input
                  controller={controller}
                  name="surname"
                  placeholder="Input a surname"
                  validate={(value) =>
                    !value?.trim() && "Provide a valid surname"
                  }
                />
              </FormRow>
              <FormRow>
                <Submit
                  ButtonComponent={FunctionalSubmitComponent}
                  controller={controller}
                >
                  Functional Component Submit
                </Submit>
              </FormRow>
              <FormRow>
                <Submit
                  ButtonComponent={ClassSubmitComponent}
                  controller={controller}
                >
                  Class Component Submit
                </Submit>
              </FormRow>
              <FormRow>
                <button type="button" onClick={() => controller.resetForm()}>
                  Reset
                </button>
              </FormRow>
            </>
          );
        }}
      </FormController>
    </>
  );
};
