import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { ChatService, Message } from './chat.service';
import { Observable } from 'rxjs';
import { scan } from 'rxjs/operators'
import { environment } from 'src/environments/environment';
import { ToastService } from 'src/app/toast.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.page.html',
  styleUrls: ['./chatbot.page.scss'],
})
export class ChatbotPage implements OnInit, AfterViewInit {
  messages: Observable<Message[]>;
  textValue: string;
  imageUrl = "";
  loginUser: any = {
    userId: 0
  };
  disableScrollDown = false
  constructor(private chat: ChatService, private toastService: ToastService, private router: Router, ) { }
  @ViewChildren('messages') messagesData: QueryList<any>;
  @ViewChild('content', null) content: ElementRef;

  async ngOnInit() {
    this.messages = this.chat.conversation.asObservable().pipe(scan((acc, val) => acc.concat(val)))
    console.log(this.messages)
    if (this.toastService.getLoginUser()) {
      this.loginUser = await this.toastService.getLoginUser();
      console.log(this.loginUser)
      let loginType = await this.toastService.getLoginUser();
      if (loginType == 'LOCAL') {
        this.imageUrl = environment.imageUrl
      }
    } else {
      this.router.navigate([''])
    }
  }

  sendMessage() {
    this.chat.converse(this.textValue);
    this.textValue = '';
  }

  ngAfterViewInit() {
    this.messagesData.changes.subscribe(this.scrollToBottom);
  }

  scrollToBottom = () => {
    try {
      this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight;
    } catch (err) { }
  }


}
