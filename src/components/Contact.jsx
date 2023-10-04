import { useEffect, useState } from "react";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";
import ky from "ky"
import 'material-icons/iconfont/material-icons.css';
import './contact.css'

function scrollToBottom () {
    const scrollingElement = (document.scrollingElement || document.body);
    scrollingElement.scrollTop = scrollingElement.scrollHeight;
}

function useEmailKeyPress () {
    const [email, setEmail] = useState('');
    const emailWriting = (e) => {
        setEmail(email => e.target.value)
    }
    return [email, emailWriting]
}

function useCodeKeyPress () {
    const [code, setCode] = useState('');
    const codeWriting = (e) => {
        setCode(c => e.target.value)
    }
    return [code, codeWriting]
}

function useFullnameKeyPress () {
    const [code, setFullname] = useState('');
    const fullnameWriting = (e) => {
        setFullname(c => e.target.value)
    }
    return [code, fullnameWriting]
}

function useSubjectKeyPress () {
    const [code, setSubject] = useState('');
    const subjectWriting = (e) => {
        setSubject(c => e.target.value)
    }
    return [code, subjectWriting]
}

function useBodyKeypress () {
    const [code, setBody] = useState('');
    const bodyWriting = (e) => {
        setBody(c => e.target.value)
    }
    return [code, bodyWriting]
}

function useFormSubmit ({valid, loading, error, response}) {
    const { executeRecaptcha } = useGoogleReCaptcha();
    const [form, setSubmitForm] = useState({valid, loading, error, response})

    const formSubmit = async (e) => {
        e.preventDefault()

        if (!executeRecaptcha) {
            console.log('Execute recaptcha not yet available');
            return;
        }

        const token = await executeRecaptcha('save_email');

        setSubmitForm((form) => {
            return {...form, loading: true}
        })

        const emailInput = e.target[0]
        const email = emailInput.value

        const baseURL = import.meta.env.PUBLIC_API_URL
        const endpointUrl = import.meta.env.PUBLIC_API_ENDPOINT_CONTACT_EMAIL
        const endpoint = new URL(endpointUrl, baseURL)

        const headers = new Headers()
        headers.append("Content-Type", "application/x-www-form-urlencoded")

        const urlencoded = new URLSearchParams()
        urlencoded.append("email", email)
        urlencoded.append("token", token)

        try {
            const response = await ky.post(endpoint, {
                headers,
                body: urlencoded,
                redirect: "follow"
            }).json()
            setSubmitForm(form => {
                return {...form, valid: true, loading: false, response: response}
            })
        } catch (error) {
            const res = await error.response?.json() ?? {message: "Une erreur s'est produite..."}
            setSubmitForm(form => {
                return {...form, valid: false, loading: false, error: res}
            })
        }
    }

    return [form, formSubmit]
}

function useFormCodeSubmit ({valid, loading, error, response}, _email) {
    const { executeRecaptcha } = useGoogleReCaptcha();
    const [form, setSubmitForm] = useState({valid, loading, error, response})

    const formSubmit = async (e) => {
        e.preventDefault()

        if (!executeRecaptcha) {
            console.log('Execute recaptcha not yet available');
            return;
        }

        const token = await executeRecaptcha('check_code');

        setSubmitForm((form) => {
            return {...form, loading: true}
        })

        const email = _email
        const codeInput = e.target[0]
        const code = codeInput.value

        const baseURL = import.meta.env.PUBLIC_API_URL
        const endpointUrl = import.meta.env.PUBLIC_API_ENDPOINT_CODE_EMAIL
        const endpoint = new URL(endpointUrl, baseURL)

        const headers = new Headers()
        headers.append("Content-Type", "application/x-www-form-urlencoded")

        const urlencoded = new URLSearchParams()
        urlencoded.append("email", email)
        urlencoded.append("code", code)
        urlencoded.append("token", token)

        try {
            const response = await ky.post(endpoint, { 
                headers,
                body: urlencoded,
                redirect: "follow"
            }).json()
            setSubmitForm(form => {
                return {...form, valid: true, loading: false, response: response}
            })
        } catch (error) {
            const res = await error.response?.json() ?? {message: "Une erreur s'est produite..."}
            setSubmitForm(form => {
                return {...form, valid: false, loading: false, error: res}
            })
        }
    }
    
    return [form, formSubmit]
}

function useFormMessageSubmit ({valid, loading, error, response}, _email, _code) {
    const { executeRecaptcha } = useGoogleReCaptcha();
    const [form, setSubmitForm] = useState({valid, loading, error, response})

    const formSubmit = async (e) => {
        e.preventDefault()

        if (!executeRecaptcha) {
            console.log('Execute recaptcha not yet available');
            return;
        }

        const token = await executeRecaptcha('send_message');

        setSubmitForm((form) => {
            return {...form, loading: true}
        })

        const email = _email
        const code = _code

        const fullnameInput = e.target[0]
        const fullname = fullnameInput.value

        const subjectInput = e.target[1]
        const subject = subjectInput.value

        const bodyInput = e.target[2]
        const body = bodyInput.value

        const baseURL = import.meta.env.PUBLIC_API_URL
        const endpointUrl = import.meta.env.PUBLIC_API_ENDPOINT_MESSAGE_EMAIL
        const endpoint = new URL(endpointUrl, baseURL)

        const headers = new Headers()
        headers.append("Content-Type", "application/x-www-form-urlencoded")

        const urlencoded = new URLSearchParams()
        urlencoded.append("email", email)
        urlencoded.append("code", code)
        urlencoded.append("fullname", fullname)
        urlencoded.append("subject", subject)
        urlencoded.append("body", body)
        urlencoded.append("token", token)

        try {
            const response = await ky.post(endpoint, { 
                headers,
                body: urlencoded,
                redirect: "follow"
            }).json()
            setSubmitForm(form => {
                return {...form, valid: true, loading: false, response: response}
            })
        } catch (error) {
            const res = await error.response?.json() ?? {message: "Une erreur s'est produite..."}
            setSubmitForm(form => {
                return {...form, valid: false, loading: false, error: res}
            })
        }
    }

    return [form, formSubmit]
}

function Loading () {
    return (
        <div className="loading">
            <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
        </div>
    )
}

function FormEmail (props) {

    const {email, form} = props
    const emailRegex = import.meta.env.PUBLIC_EMAIL_SYNTAX
    const emailPattern = new RegExp(emailRegex)
    const syntaxEmailIsBad = !(emailPattern.test(email))

    useEffect(() => {
        props.formSubmit;
    }, [props.formSubmit])

    useEffect(() => {
        form.error = null
    }, [email])

    return (
        <>
            <form method="post" className="form-contact" onSubmit={props.formSubmit}>
                <div>
                    <input type="email" autoComplete="off" name="email" id="email" placeholder="Votre adresse électronique" defaultValue={props.email} onKeyUp={props.emailWriting} required/>
                    <button type="submit" disabled={syntaxEmailIsBad}>Envoyer</button>
                </div>
                { (email && (syntaxEmailIsBad == true)) || (form.error != null) ? 
                    <div className="error-form error-s">
                        <span className="material-icons">announcement</span> 
                        <div>
                        { form.error?.message || "Email non valide" }
                        </div>
                    </div> 
                : 
                    null 
                }
            </form>
        </>
    )
}

function FormCode ({formCodeSubmit, email, code, codeWriting, formCode}) {

    useEffect(() => {
        formCodeSubmit
    }, [formCodeSubmit])
    
    useEffect(() => {
        formCode.error = null
    }, [code])

    return (
        <form method="post" className="form-contact form-code" onSubmit={formCodeSubmit}>
            <p className="text-code">
                Un code de vérification a été envoyée à l'adresse { email }
            </p>
            <div>
                <input type="text" defaultValue={code} name="code" id="code" placeholder="Code de vérification..." autoComplete="off" onKeyUp={codeWriting} required/>
                <button type="submit">Valider</button>
            </div>
            { formCode.error != null && 
                <div className="error-form error-s">
                    <span className="material-icons">announcement</span> 
                    <div>
                    { formCode.error?.message || "Code non valide" }
                    </div>
                </div> 
            }
        </form>
    )
}

function FormMessage ({formMessageSubmit, email, fullname, body, subject, formMessage, fullnameWriting, subjectWriting, bodyWriting}) {

    useEffect(() => {
        formMessageSubmit
    }, [formMessageSubmit])

    const nameFieldFullname = import.meta.env.PUBLIC_FORM_CONTACT_ERROR_FIELD_NAME_FULLNAME
    const nameFieldSubject = import.meta.env.PUBLIC_FORM_CONTACT_ERROR_FIELD_NAME_SUBJECT
    const nameFieldBody = import.meta.env.PUBLIC_FORM_CONTACT_ERROR_FIELD_NAME_BODY

    return (
        <form method="post" className="form-contact form-code form-message" onSubmit={formMessageSubmit}>
            <div>
                <p className="text-message">
                    Votre adresse électronique { email ?? '__' } à été validée !<br/>
                </p>
                <input type="text" name="fullname" placeholder="Nom Complet..." defaultValue={fullname} onKeyUp={fullnameWriting}/>
                { ((formMessage.error != null) && (formMessage.error?.field == nameFieldFullname)) &&
                <div className="error-form-message">
                    <span className="material-icons">announcement</span> 
                    <div>
                        { formMessage.error?.message || "Nom non valide" }
                    </div>
                </div>
                }
                <input type="text" name="subject" placeholder="Sujet du message..." defaultValue={subject} onKeyUp={subjectWriting}/>
                { (formMessage.error != null && formMessage.error?.field == nameFieldSubject) && 
                <div className="error-form-message">
                    <span className="material-icons">announcement</span> 
                    <div>
                        { formMessage.error?.message || "Sujet non valide" }
                    </div>
                </div> 
                }
                <textarea name="body" placeholder="Corps du message..." defaultValue={body} onKeyUp={bodyWriting}/>
                { (formMessage.error != null && formMessage.error?.field == nameFieldBody) && 
                <div className="error-form-message">
                    <span className="material-icons">announcement</span> 
                    <div>
                        { formMessage.error?.message || "Message non valide" }
                    </div>
                </div> 
                }
                <button type="submit">Envoyer mon message</button>
            </div>
            { formMessage?.error != null && 
                <div className="error-form error-s">
                    <span className="material-icons">announcement</span> 
                    <div>
                        { formMessage.error?.message || "Une erreur est présente dans le formulaire..." }
                    </div>
                </div> 
            }
        </form>
    )
}

function FormsContact () {

    const [email, emailWriting] = useEmailKeyPress()
    const [code, codeWriting] = useCodeKeyPress()
    const [fullname, fullnameWriting] = useFullnameKeyPress()
    const [subject, subjectWriting] = useSubjectKeyPress()
    const [body, bodyWriting] = useBodyKeypress()
    const [form, formSubmit] = useFormSubmit({valid: false, loading: false, response: null, error: null})
    const [formCode, formCodeSubmit] = useFormCodeSubmit({valid: false, loading: false, response: null, error: null}, email)
    const [formMessage, formMessageSubmit] = useFormMessageSubmit({valid: false, loading: false, response: null, error: null}, email, code)


    return (
        <>
            { formMessage.valid ? 
                <p style={{margin: '2em'}}>
                    Vous serez recontacté à l'adresse  
                    <div>
                        {email ?? "__"}
                    </div>
                </p>
            : formCode.valid ? 
                formMessage.loading ? <Loading /> :
                <FormMessage 
                    formMessage={formMessage}
                    formMessageSubmit={formMessageSubmit}
                    fullnameWriting={fullnameWriting}
                    subjectWriting={subjectWriting}
                    bodyWriting={bodyWriting}
                    fullname={fullname}
                    body={body}
                    subject={subject}
                    email={email}
                />
            :
                form.valid ? 
                    formCode.loading ? <Loading /> :
                        <FormCode 
                            formCode={formCode}
                            formCodeSubmit={formCodeSubmit}
                            email={email}
                            code={code}
                            codeWriting={codeWriting}
                        />
                :
                form.loading ?
                    <Loading />
                : 
                    <FormEmail 
                        form={form}
                        email={email} 
                        emailWriting={emailWriting} 
                        formSubmit={formSubmit} 
                    />
            }
        </>
    );
}

export function Contact () {
    const GOOGLE_RECAPTCHA_KEY = import.meta.env.PUBLIC_RECAPTCHA_KEY

    return <GoogleReCaptchaProvider reCaptchaKey={GOOGLE_RECAPTCHA_KEY}>
        <FormsContact />
    </GoogleReCaptchaProvider>
}