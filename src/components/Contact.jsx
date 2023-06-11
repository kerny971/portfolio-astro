import { useState0 } from "react";
import './contact.css'

function handleForm (e) {
    e.preventDefault();
    console.log(e);
}

export function Contact () {
    return (
        <form onSubmit={(e) => handleForm(e)}>
            <div>
                <input type="email" name="email" id="email" placeholder="Votre adresse électronique"/>
            </div>
            <div>
                <input type="firstname" name="firstname" id="firstname" placeholder="Votre prénom."/>
            </div>
            <div>
                <input type="lastname" name="lastname" id="lastname" placeholder="Votre nom de Famille"/>
            </div>
            <div>
                <input type="sujet" name="sujet" id="sujet" placeholder="Votre sujet"/>
            </div>
            <div>
                <textarea type="message" name="message" id="message" placeholder="Votre message..."></textarea>
            </div>
            <button type="submit">Envoyer mon message</button>
        </form>
    )
}