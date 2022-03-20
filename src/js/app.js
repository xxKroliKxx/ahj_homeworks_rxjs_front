import {ajax} from 'rxjs/ajax';
import {interval, switchMap} from 'rxjs';
import {map} from 'rxjs/operators';

const board = document.getElementsByClassName('board')[0]

interval(5000).pipe(
    switchMap(val =>
        ajax({
            url: 'https://ahj-homeworks-rxjs-back.herokuapp.com/v1/messages/unread',
            method: 'GET',
        })),
    map(res =>
        res.status === 200 ? res.response : []
    )
).subscribe(
    outputMessage
)

const formatter = new Intl.DateTimeFormat("ru", {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
});

function outputMessage(messages) {

    messages.forEach(message => {
            const received = new Date(message.received);
            let date = formatter.format(received).replace(',', "")
            date = date.slice(date.indexOf(' ') + 1) + ' ' + date.slice(0, date.indexOf(' '))

            const element = document.createElement('div')
            element.dataset.ID = message.id
            element.classList.add('message')
            element.innerHTML = `
            <span class="title"> ${message.from} </span>
            <span class="subject"> ${message.subject.length > 15 ? message.subject.slice(0, 15) + '...' : message.subject} '</span>
            <span class="date"> ${date} </span>`
            board.prepend(element)
        }
    )
}