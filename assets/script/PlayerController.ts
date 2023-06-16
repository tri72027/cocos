import { _decorator, Animation, Component, EventMouse, Node, systemEvent, SystemEventType, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    @property(
        {
            type: Animation
        }
    )

    pika: Animation =null;

    private _startJump = false;         // bắt đầu có nhảy hay không
    private _jumpStep = 0;              // số bước nhảy( độ dài bước nhảy)
    private _curJumpTime = 0;           // thời gian nhảy hiện tại
    private _jumpTime = 0.1;           // thời gian nhảy hiện tại
    private _curJumpSpeed = 0;         // tốc độ của bước nhảy hiện tại
    private _curPos = new Vec3();       // vị trí hiện tại
    private _targetPos = new Vec3();    // vị trí của nhân vật
    private _deltaPos = new Vec3()      // sự kahcs biệt về chuyển động của nhân vật
    private _isMoving = false;
    start() {
        systemEvent.on(SystemEventType.MOUSE_UP, this.onMouseUp, this)
    }

    onMouseUp(event: EventMouse) {
        if (event.getButton() === 0) {
            this.jumpByStep(1)
        }
        else if (event.getButton() === 2) {
            this.jumpByStep(2)
        }
    }

    jumpByStep(step: number) {
        if(this._isMoving)
        {
            return
        }
        this._startJump = true;
        this._jumpStep = step;
        this._curJumpSpeed = this._jumpStep / this._jumpTime;
        this._curJumpTime = 0;
        this.node.getPosition(this._curPos); // lấy vị trí hiện tại của nhân vật
        Vec3.add(this._targetPos, this._curPos, new Vec3(step, 0, 0));                          // lấy vị trí của mục tiêu muốn chuyển đến
        console.log('pi: '+ this.pika)
        if(this.pika)
        {
            this.pika.play('Jump');
            console.log('pi: '+ this.pika);
        }
    }
    update(deltaTime: number) {
        if(this._startJump)
        {
            this._curJumpTime += deltaTime;
            if(this._curJumpTime > this._jumpTime)
            {
                this.node.setPosition(this._targetPos);
                this._startJump = false
                this.onOnceJumpEnd()
            }
            else{
                this.node.getPosition(this._curPos); 
                this._deltaPos.x = this._curJumpSpeed * deltaTime;
                Vec3.add(this._curPos, this._curPos, this._deltaPos);   
                this.node.setPosition(this._curPos);
            }
        }
       
    }
    onOnceJumpEnd() {
        this._isMoving = false
    }
}


