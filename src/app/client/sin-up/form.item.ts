export class FormItem {

  constructor(
    public  isRequired: boolean = false,
    public inputName: string,
    public label: string,
    public placeHolder: string,
    public value: string,
    public typeInput: string,
    public valueSelect: any
  ) {
  }
}
