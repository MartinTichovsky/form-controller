export const Info = () => {
  return (
    <div>
      <h3>Form Controller Examples</h3>
      <p style={{ width: 500 }}>
        Except for Full Featured examples, the examples are included from
        form-controller where they are used for integration and unit tests. On
        the top of the form is a button "Re-Render Form" which re-render the
        whole component with the form. This re-render should not influence the
        form. That means, the form must be still the same. The Submit button
        will log a result of the form to the browser console if the form is
        valid. The reset button should reset all fields to default.
      </p>
    </div>
  );
};
