import React from 'react'
import { SignupForm, Navbar } from 'components'

class Signup extends React.Component {
    render() {
        return (
            <div style={{ flex: '1' }}>
                <Navbar />
                <SignupForm onSubmit={this.props.handleSignup} />
            </div>
        )
    }
}

export default Signup;
