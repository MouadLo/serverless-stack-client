class MyComponent extends React.Component {
  state = {
    Bar: null
  };

  componentWillMount() {
    import('./components/Bar').then(Bar => {
      this.setState({ Bar: Bar.default });
    });
  }

  render() {
    let {Bar} = this.state;
    if (!Bar) {
      return <div>Loading...</div>;
    } else {
      return <Bar/>;
    };
  }
}
