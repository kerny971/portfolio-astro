import { useEffect, useState } from "react";
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
        console.log(e)
        setCode(c => e.target.value)
    }
    return [code, codeWriting]
}

function useFormSubmit ({valid, loading, error, response}) {
    const [form, setSubmitForm] = useState({valid, loading, error, response})

    const formSubmit = async (e) => {
        e.preventDefault()
        setSubmitForm((form) => {
            return {...form, loading: true}
        })

        const baseURL = import.meta.env.PUBLIC_API_URL
        const endpointUrl = import.meta.env.PUBLIC_API_ENDPOINT_MESSAGE_EMAIL
        const endpoint = new URL(endpointUrl, baseURL)
        try {
            const response = await ky.post(endpoint, { method: 'POST' }).json()
            console.log(response)
            setSubmitForm(form => {
                return {...form, valid: true, loading: false, response: response}
            })
        } catch (error) {
            const res = await error.response.json()
            console.log(res)
            setSubmitForm(form => {
                return {...form, valid: false, loading: false, error: res}
            })
        }
    }

    return [form, formSubmit]
}

function useFormCodeSubmit ({valid, loading}) {
    const [form, setSubmitForm] = useState({valid, loading})

    const formSubmit = (e) => {
        e.preventDefault()
        setSubmitForm((form) => {
            return {...form, loading: true}
        })
        setTimeout(() => {
            setSubmitForm(form => {
                return {...form, valid: true, loading: false}
            })
            scrollToBottom()
        }, 5000)
    }
    return [form, formSubmit]
}

function useFormMessageSubmit ({valid, loading}) {
    const [form, setSubmitForm] = useState({valid, loading})

    const formSubmit = (e) => {
        console.log(e)
        e.preventDefault()
        setSubmitForm((form) => {
            return {...form, loading: true}
        })
        setTimeout(() => {
            setSubmitForm(form => {
                return {...form, valid: true, loading: false}
            })
            scrollToBottom()
        }, 5000)
    }
    return [form, formSubmit]
}


function Loading () {
    return (
        <div className="loading">
            <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
        </div>
    )
}

function FormEmail (props) {
    const {email, form} = props
    const emailRegex = import.meta.env.PUBLIC_EMAIL_SYNTAX
    const emailPattern = new RegExp(emailRegex)
    const syntaxEmailIsBad = !(emailPattern.test(email))

    useEffect(() => {
        form.error = null
    }, [email])

    console.log(form)
    return (
        <>
            <form method="post" className="form-contact" onSubmit={props.formSubmit}>
                <div>
                    <input type="email" autoComplete="off" name="email" id="email" placeholder="Votre adresse électronique" defaultValue={props.email} onKeyUp={props.emailWriting} />
                    <button type="submit" disabled={syntaxEmailIsBad}>Envoyer</button>
                </div>
                { (email && (syntaxEmailIsBad == true)) || (form.error != null) ? 
                    <div className="error-form error-s">
                        <span class="material-icons">announcement</span> 
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

function FormCode ({formCodeSubmit, email, code, codeWriting}) {
    return (
        <form method="post" className="form-contact form-code" onSubmit={formCodeSubmit}>
            <p className="text-code">
                Un code de vérification a été envoyée à l'adresse { email } <br/>
            </p>
            <div>
                <input type="text" defaultValue={code} name="code" id="code" placeholder="Code de vérification..." onKeyUp={codeWriting}/>
                <button type="submit">Valider</button>
            </div>
        </form>
    )
}

function FormMessage ({formMessageSubmit, email}) {
    return (
        <form method="post" className="form-contact form-code form-message" onSubmit={formMessageSubmit}>
            <div>
                <p className="text-message">
                    Votre adresse électronique { email } à été validée !<br/>
                </p>
                <input type="text" name="message[fullname]" placeholder="Nom Complet..." />
                <input type="text" name="message[subject]" placeholder="Sujet du message..." />
                <textarea name="message[body]" placeholder="Corps du message..." />
                <button type="submit">Envoyer mon message</button>
            </div>
        </form>
    )
}

function FormsContact () {

    const [email, emailWriting] = useEmailKeyPress()
    const [code, codeWriting] = useCodeKeyPress()
    const [form, formSubmit] = useFormSubmit({valid: false, loading: false, response: null, error: null})
    const [formCode, formCodeSubmit] = useFormCodeSubmit({valid: false, loading: false, error: null})
    const [formMessage, formMessageSubmit] = useFormMessageSubmit({valid: false, loading: false, error: null})


    return (
        <>
            { formMessage.valid ? 
                <p style={{margin: '1em'}}>
                    Votre message à bien été envoyée ! Vous serez recontacté par courriel à l'adresse <br/> {email ?? __}
                </p>
            : formCode.valid ? 
                formMessage.loading ? <Loading /> :
                <FormMessage 
                    formMessageSubmit={formMessageSubmit}
                    email={email}
                />
            :
                form.valid ? 
                    formCode.loading ? <Loading /> :
                        <FormCode 
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
    return <FormsContact />
}