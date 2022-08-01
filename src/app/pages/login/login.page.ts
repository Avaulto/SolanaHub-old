import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, RequiredValidator, Validators } from '@angular/forms';
import { faDiscord, faGithub, faGoogle, faMedium, faMediumM, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faExclamationCircle, faGasPump } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild('errEl') errEl: ElementRef;
  public gAuthIcon = faGoogle
  public signForm: UntypedFormGroup;
  public isSubmitted: boolean = false;
  public tooltipIcon = faExclamationCircle;
  constructor(
    public auth:AuthService,
    private fb:UntypedFormBuilder
    ) { 
      this.signForm = this.fb.group({
        email: new UntypedFormControl('',[Validators.required, Validators.email]),
        password: new UntypedFormControl('',[Validators.minLength(6), Validators.required]),
      })
    }
  public slidesInfo = [{
    title:'Get started!',
    desc:`easly track your assets in 1 ultimate app, get full review of your portfolio, from all your favirite assest`,
    image:'assets/images/slide-placeholder.svg'
  },
  {
    title:'1 wallet',
    desc:`your everyday use wallet for perform any transactions, read history from multipale wallets & assets`,
    image:'assets/images/slide-placeholder.svg'
  },
  {
    title:'Defi made easy',
    desc:`Start staking, swaping, LP & get your NFT, all at one place! `,
    image:'assets/images/slide-placeholder.svg'
  }]
  public segmentAuthTab:string = 'sign-in'
  ngOnInit() {
    
  }
  setSignType(type: string){
    this.segmentAuthTab = type;
    this.signForm.reset()
    this.generateFb(type);
  }
  generateFb(type:string){

    if(type == 'register'){
      this.signForm.addControl('passwordAgain', new UntypedFormControl('',[Validators.minLength(6), Validators.required]))
    }else{
      this.signForm.removeControl('passwordAgain')
    }
    return  this.signForm 
  }
  async submitForm(){
    this.isSubmitted = true
    const {email, password} = this.signForm.value;
    try {
      
    if(this.segmentAuthTab == 'register'){
      const res = await this.auth.createUserWithEmailAndPassword(email, password);
    }else{
        await this.auth.signInWithEmailAndPw(email,password);
    }
  } catch (error) {
    console.log(error)
      this.errEl.nativeElement.innerHTML = error.message
  }
    // this.isSubmitted = false;
  }
  public icon=faGasPump;
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    // autoplay: {
    //   delay: 3000,
    // },
  };
  public socials = [
    {
    icon: faTwitter,
    url:'https://twitter.com/Avaulto'
  },
  {
    icon: faMediumM,
    url:'https://avaulto.medium.com/'
  },
  {
    icon: faDiscord,
    url:'https://discord.gg/k5fysUkh7V'
  },
  {
    icon: faGithub,
    url:'https://github.com/avaulto'
  }
]
}
