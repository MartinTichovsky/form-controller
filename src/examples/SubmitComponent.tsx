import React from "react";
import { Controller, FormController, Input, Submit } from "../";
import { Template } from "./utils/Template";

type MyForm = {
  givenName: string;
  surname: string;
};

const FunctionalSubmitComponent = ({
  children,
  disabled,
  onClick,
  ...rest
}: React.PropsWithChildren<{
  disabled: boolean; // required
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => Controller<MyForm>; // required
}>) => {
  const [pending, setPending] = React.useState(false);
  const isMounted = React.useRef(true);

  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, [isMounted]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const controller = onClick(event);

    if (controller.isValid) {
      console.log(controller.fields);

      setPending(true);

      // simulate HTTML request / delay
      setTimeout(() => {
        // this condition avoids react errors when navigate in the menu
        if (isMounted.current) {
          setPending(false);
        }
      }, 2000);
    }
  };

  return (
    <button {...rest} disabled={disabled} onClick={handleClick}>
      {pending ? "functional component pending..." : children}
    </button>
  );
};

interface ClassSubmitComponentProps {
  disabled: boolean; // required
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => Controller<MyForm>; // required
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

      // simulate HTTML request / delay
      setTimeout(() => {
        // this condition avoids react errors when navigate in the menu
        if (this.componentIsMounted) {
          this.setState({ pending: false });
        }
      }, 2000);
    }
  };

  render() {
    const { disabled, children, ...rest } = this.props;

    return (
      <button {...rest} disabled={disabled} onClick={this.handleClick}>
        {this.state.pending ? "class component pending..." : children}
      </button>
    );
  }
}

export const SubmitComponent = () => {
  return (
    <Template>
      <FormController<MyForm> style={{ marginTop: 15 }} validateOnChange>
        {(controller) => (
          <>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="input-1"
                name="givenName"
                placeholder="Input a given name"
                validate={(value) =>
                  !value?.trim() && "Provide a valid given name"
                }
              />
            </div>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="input-2"
                name="surname"
                placeholder="Input a surname"
                validate={(value) =>
                  !value?.trim() && "Provide a valid surname"
                }
              />
            </div>
            <div className="field-row">
              <Submit
                ButtonComponent={FunctionalSubmitComponent}
                controller={controller}
                data-testid="functional-submit"
              >
                Functional Component Submit
              </Submit>
            </div>
            <div className="field-row">
              <Submit
                ButtonComponent={ClassSubmitComponent}
                controller={controller}
                data-testid="class-submit"
              >
                Class Component Submit
              </Submit>
            </div>
            <div className="field-row">
              <button
                data-testid="reset"
                onClick={() => controller.resetForm()}
                type="button"
              >
                Reset
              </button>
            </div>
            <div className="info">
              * Fill all inputs and click on a submit button. Text should change
              and simulate HTTP request / delay.
            </div>
          </>
        )}
      </FormController>
    </Template>
  );
};
