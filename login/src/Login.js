import { useState, useRef } from "react";

export default function Login() {
    // need 1 form with 2 entries for login/pass
    // need 2 buttons, one for submit and one to create an account

    // https://dev.to/avinashvagh/useref-forms-input-handling-in-react-11f
    // useful article for how to handle stuff with forms (most useful was conditional rendering)
    // https://react.dev/reference/react-dom/components/input
    // used to figure out how to extract form entries on submission as a FormData object
    // https://developer.mozilla.org/en-US/docs/Web/API/FormData
    // useful to figure out how to interact with FormData

    // these are used to directly interact with the text in the login form
    // this is useful for when you register and want to put the new credentials directly into the form
    const userRef = useRef(null);
    const passRef = useRef(null);

    const [loginState, setLoginState] = useState({user: '', pass: ''})
    const [loggedIn, setLoggedIn] = useState(false);
    const [isMissing, setIsMissing] = useState(false);
    const [wrongCredentials, setWrongCredentials] = useState(false);

    const [isRegistering, setIsRegistering] = useState(false);

    // only sets the state when you press enter or the login button
    const handleLogin = (e) => {
        // https://www.w3schools.com/jsref/event_preventdefault.asp
        // since this handles a submit event, preventDefault is needed because the default of a submit event causes
        // the page to refresh, which wipes out all the state that we have built so far
        e.preventDefault();

        // undo this error message for a fresh start to this check
        setWrongCredentials(false);

        // it doesn't make sense to be trying to log in and register at the same time, so just get rid of registration form
        setIsRegistering(false);

        const formData = new FormData(e.target);
        const sub_user = formData.get('user');
        const sub_pass = formData.get('pass');

        // have to input something in all areas of the form
        // show an error message
        if (sub_user === '' || sub_pass === '')  {
            setIsMissing(true);
            return;
        }

        setIsMissing(false);

        if (sub_user === loginState.user && sub_pass === loginState.pass)  {
            setLoggedIn(true);
        } else {
            // show error message for incorrect information
            setWrongCredentials(true);
        }
    };

    function handleLogout() {
        setLoggedIn(false);
    }

    // change the loginState to now have the newly registered information
    function handleSuccessfulRegister(newUser, newPass) {
        setIsRegistering(false);
        setLoginState({user: newUser, pass: newPass});

        // after some troubleshooting, found out that you have to set these values directly to newUser and newPass
        // if you set them to the things in loginState, it will not work because the state does not actually change
        // until the next render, so this would put the old values into the refs instead
        userRef.current.value = newUser;
        passRef.current.value = newPass
    }

    // show the register form
    function createRegister() {
        setIsRegistering(true);
    }

    if (loggedIn) {
        return <div>Currently logged in as {loginState.user} <button type="button" onClick={handleLogout}>Log Out</button> </div>
    } else {
        // https://www.w3schools.com/css/css3_flexbox.asp
        // used this to force the login and register forms to be horizontally aligned
        return (
            <div style={{display: 'flex', flexDirection: 'row', gap: '10px'}}>
                <form onSubmit={handleLogin}>
                    <h2>Login</h2>

                    {isMissing && (
                        <p>You must fill out all fields in the form</p>
                    )}

                    {wrongCredentials && (
                        <p>Incorrect Username and Password</p>
                    )}

                    <div>
                        <label> Username:
                            <input
                                type="text"
                                name="user"
                                ref={userRef}
                            />
                        </label>
                    </div>

                    <br/>

                    <div>
                        <label>
                            Password:
                            <input
                                type="password"
                                name="pass"
                                ref={passRef}
                            />
                        </label>
                    </div>

                    <br/>

                    <div>
                        <button type="submit">Login</button>
                        {!isRegistering && <button type="button" onClick={createRegister}>Create Account</button>}
                    </div>
                </form>

                {isRegistering && <Register handleSuccessfulRegister={handleSuccessfulRegister}/>}
            </div>
        )
    }
}

function Register({ handleSuccessfulRegister }) {
    // need 1 form with 4 entries for name, email, login, and password
    // need one button for enter

    const [isMissing, setIsMissing] = useState(false);

    const handleRegister = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const sub_name = formData.get('name');
        const sub_email = formData.get('email');
        const sub_user = formData.get('user');
        const sub_pass = formData.get('pass');

        // have to input something in all areas of the form
        // show an error message
        if (sub_name === '' || sub_email === '' || sub_user === '' || sub_pass === '')  {
            setIsMissing(true);
            return;
        }

        setIsMissing(false);

        handleSuccessfulRegister(sub_user, sub_pass);
    };

    return (
        <div>
            <form onSubmit={handleRegister}>
                <h2>Create Account</h2>

                {isMissing && (
                    <p>You must fill out all fields in the form</p>
                )}

                <div>
                    <label>Name:
                        <input
                            type={"text"}
                            name="name"
                        />
                    </label>
                </div>

                <br/>

                <div>
                    <label>Email:
                        <input
                            type="email"
                            name="email"
                        />
                    </label>
                </div>

                <br/>

                <div>
                    <label>Username:
                        <input
                            type={"text"}
                            name="user"
                        />
                    </label>
                </div>

                <br/>

                <div>
                    <label>Password:
                        <input
                            type="password"
                            name="pass"
                        />
                    </label>
                </div>
                <div><button type="submit">Submit</button></div>
            </form>
        </div>
    )
}