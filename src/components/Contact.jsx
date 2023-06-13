import { useState0 } from "react";
import './contact.css'

function handleForm (e) {
    e.preventDefault();
    console.log(e);
}

export function Contact () {
    return (
        <form className="form-contact" onSubmit={(e) => handleForm(e)}>
            <div>
                <input type="email" name="email" id="email" placeholder="Votre adresse électronique"/>
                <button type="submit">Envoyer mon message</button>
            </div>
        </form>
    )
}