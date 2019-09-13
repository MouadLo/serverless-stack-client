import React, { Component } from "react";
import { Auth } from "aws-amplify";
import {
  HelpBlock,
  FormGroup,
  FormControl,
  ControlLabel,
  Alert
} from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./ChangeEmail.css";

export default class ChangeEmail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: "",
      email: "",
      prev_email: "",
      codeSent: false,
      isConfirming: false,
      isSendingCode: false,
      user: undefined,
      email_verified: false
    };
    
  }
  async componentDidMount() {
    const user = await Auth.currentUserInfo();
    this.setState({ email_verified: user.attributes.email_verified})
    this.setState({ prev_email: user.attributes.email})
    console.log(user)
    
  }
  validatEmailForm() {
    return this.state.email.length > 0;
  }

  validateConfirmForm() {
    return this.state.code.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleUpdateClick = async event => {
    event.preventDefault();

    this.setState({ isSendingCode: true });

    try {
      const user = await Auth.currentAuthenticatedUser();
      await Auth.updateUserAttributes(user, { email: this.state.email });
    
      this.setState({ codeSent: true });
    } catch (e) {
      alert(e.message);
      this.setState({ isSendingCode: false });
    }
  };
  
  
  handleVerificationClick = async event => {
    event.preventDefault();

    this.setState({ isSendingCode: true });

    try {
      await Auth.verifyCurrentUserAttribute("email")
      this.setState({ codeSent: true });
    } catch (e) {
      alert(e.message);
      this.setState({ isSendingCode: false });
    }
  };

  handleConfirmClick = async event => {
    event.preventDefault();

    this.setState({ isConfirming: true });

    try {
      await Auth.verifyCurrentUserAttributeSubmit("email", this.state.code);

      this.props.history.push("/settings");
    } catch (e) {
      alert(e.message);
      this.setState({ isConfirming: false });
    }
  };

  renderUpdateForm() {
    return (
      <div>
        <form onSubmit={this.handleUpdateClick}>
         <FormGroup bsSize="large" controlId="prev_email">
            <ControlLabel>Email</ControlLabel>
            <FormControl
              autoFocus
              disabled={true}
              type="prev_email"
              value={this.state.prev_email}
            />
          </FormGroup>
           {!this.state.email_verified ?
               <Alert  variant='warning'>
                Email Not Verified{' '}
                <button onClick={this.handleVerificationClick}>Please confirm your email</button>
               </Alert> : <div> </div>
           } 
          <FormGroup bsSize="large" controlId="email">
            <ControlLabel>New Email</ControlLabel>
            <FormControl
              autoFocus
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormGroup>
          <LoaderButton
            block
            type="submit"
            bsSize="large"
            text="Update Email"
            loadingText="Updating…"
            disabled={!this.validatEmailForm()}
            isLoading={this.state.isSendingCode}
          />
        </form>
      </div>
    );
  }

  renderConfirmationForm() {
    return (
      <form onSubmit={this.handleConfirmClick}>
        <FormGroup bsSize="large" controlId="code">
          <ControlLabel>Confirmation Code</ControlLabel>
          <FormControl
            autoFocus
            type="tel"
            value={this.state.code}
            onChange={this.handleChange}
          />
          <HelpBlock>
            Please check your email ({this.state.email}) for the confirmation
            code.
          </HelpBlock>
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          text="Confirm"
          loadingText="Confirm…"
          isLoading={this.state.isConfirming}
          disabled={!this.validateConfirmForm()}
        />
      </form>
    );
  }

  render() {
    return (
      <div className="ChangeEmail">
        {!this.state.codeSent
          ? this.renderUpdateForm()
          : this.renderConfirmationForm()}
      </div>
    );
  }
}
