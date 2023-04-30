import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-app';

  isUserPerformOnCB = false;

  menuList = [
    { id: 1, title: 'Dashboard', rawMenus: [
      { id: 101, title: 'View Dashboard' },
      { id: 102, title: 'Edit Dashboard' }
    ]},
    { id: 2, title: 'Users', rawMenus: [
      { id: 101, title: 'View Dashboard' },
      { id: 102, title: 'Edit Dashboard' }
    ]},
    { id: 3, title: 'Roles', rawMenus: [
      { id: 101, title: 'View Dashboard' },
      { id: 102, title: 'Edit Dashboard' }
    ]}
  ];

  assaignMenuList = [
    {
       id: 1, title: 'Dashboard', rawMenus: [
        { id: 101, title: 'View Dashboard' }
      ]
    },
    { id: 2, title: 'Users', rawMenus: [
      { id: 101, title: 'View Dashboard' },
      { id: 102, title: 'Edit Dashboard' }
    ]}
  ]

  userGroupPermisisonForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.userGroupPermisisonForm = this.formBuilder.group({
      menuBeans: this.formBuilder.array(
        this.menuList.map(item => this.formBuilder.group({
          status: [false],
          permissions: this.formBuilder.array(
            item.rawMenus.map(rowMenu => this.formBuilder.group({
              id: [rowMenu.id],
              allowed: [false]
            }))
          )
        }))
      )
    });

    setTimeout(()=>{
      console.log('patch data....')
        this.patchMenu();
    },500)
  }

  // setPermission(item: any, checked: boolean, rowMenu: any) {
  //   const menuId = rowMenu.id;
  //   for (let i = 0; i < this.menuList.length; i++) {
  //     if (this.menuList[i].id === item.id) {
  //       const permissions = this.userGroupPermisisonForm.get(`menuBeans.${i}.permissions`) as FormArray;
  //       for (let j = 0; j < permissions.length; j++) {
  //         const permission = permissions.at(j) as FormGroup;
  //         if (permission.value.id === menuId) {
  //           permission.patchValue({
  //             allowed: checked
  //           });
  //           break;
  //         }
  //       }
  //       break;
  //     }
  //   }
  // }

  setPermission(item: any, checked: boolean, rowMenu: any) {
    this.isUserPerformOnCB = true;
    console.log(item)
    const menuId = rowMenu.id;

        const permissions = this.userGroupPermisisonForm.get(`menuBeans.${item}.permissions`) as FormArray;
        for (let j = 0; j < permissions.length; j++) {
          const permission = permissions.at(j) as FormGroup;
          if (permission.value.id === menuId) {
            permission.patchValue({
              allowed: checked
            });
            break;
          }
        }
      
    }


  getCheckStatus(menuId: number): boolean {
    for (let i = 0; i < this.menuList.length; i++) {
      const item = this.userGroupPermisisonForm.get(`menuBeans.${i}`) as FormGroup;
      if (item.value.status) {
        const permissions = item.get('permissions') as FormArray;
        for (let j = 0; j < permissions.length; j++) {
          const permission = permissions.at(j) as FormGroup;
          if (permission.value.id === menuId) {
            return permission.value.allowed;
          }
        }
      }
    }
    return false;
  }

  isPermissionAllowed(item: any,menuIndex:number, rowMenu: any,rawMenuIndex:number): boolean {
    const menuId = item.id;
    const rawMenuId = rowMenu.id;
   // console.log('menuId :',menuId,' rawMenuId ',rawMenuId,' result ::',this.isRawMenuPresent(menuId,menuIndex,rawMenuId,rawMenuIndex))
    return this.isRawMenuPresent(menuId,menuIndex,rawMenuId,rawMenuIndex);
  }

  isRawMenuPresent(menuId: number,menuIndex:number, rawMenuId: number,rawMenuIndex:number ): boolean {

    const permissions = this.userGroupPermisisonForm.get(`menuBeans.${menuIndex}.permissions`) as FormArray;

    for (const menu of this.assaignMenuList) {
      if (menu.id === menuId) {
        for (const rawMenu of menu.rawMenus) {
          if (rawMenu.id === rawMenuId) {
            const permission = permissions.at(rawMenuIndex) as FormGroup;
              permission.patchValue({
                allowed: true
              });
            return true;
          }
        }
      }
    }
    return false;
  }

  patchMenu(){
    let menuBeans: { status: boolean; }[] = [];
    this.menuList.forEach((data,index)=>{
      if(this.isPresentAtAssaignData(data.id)){
        menuBeans.push({
          status: true
        });
      }else{
        menuBeans.push({
          status: false
        });
      }
       
    })

       this.userGroupPermisisonForm.patchValue({menuBeans})
  }

  isPresentAtAssaignData(id:any):boolean{
    for (const item of this.assaignMenuList) {
      if(item.id === id){
        return true;
      }
    }
    return false;
  }
  onSubmit(){
    console.log(this.userGroupPermisisonForm.get('menuBeans')?.value);
  }

}
