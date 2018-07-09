Var MSG

; 安装程序初始定义常量
!define PRODUCT_NAME "东方财富证券委托"
!define SHORTCUT_NAME "东方财富证券委托"
!define PRODUCT_VERSION "2.13.5.21"
!define PRODUCT_PUBLISHER "东方财富信息股份有限公司"
!define PRODUCT_WEB_SITE "http://www.eastmoney.com"
!define PRODUCT_DIR_REGKEY "Software\Microsoft\Windows\CurrentVersion\App Paths\Goto.exe"
!define PRODUCT_UNINST_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}"
!define PRODUCT_UNINST_ROOT_KEY "HKLM"
!define PRODUCT_DEFAULT_PATH "C:\Goto"
!define PRODUCT_EXE_NAME "Setup.exe"


!AddPluginDir .
!include "MUI.nsh"
!include "WinCore.nsh"
!include "nsWindows.nsh"
!include "FileFunc.nsh"
!include "Util.nsh"

SetCompressor /solid lzma
SetCompressorDictSize 32

!define MUI_UI UI.exe

MiscButtonText "上一歩" "接受" "取消" ""
InstallButtonText "下一歩"
InstallDir ${PRODUCT_DEFAULT_PATH}

!define MUI_ICON "img\icon.ico"
!define MUI_CUSTOMFUNCTION_GUIINIT myGuiInit
!define PBM_SETBARCOLOR 0x0409
!define PBM_SETBKCOLOR 0x2001
Page custom test2

!define MUI_PAGE_CUSTOMFUNCTION_SHOW test3
!insertmacro MUI_PAGE_INSTFILES

Page custom test4


; 安装卸载过程页面
!define MUI_PAGE_CUSTOMFUNCTION_SHOW un.test3
!insertmacro MUI_UNPAGE_INSTFILES


; 安装界面包含的语言设置
!insertmacro MUI_LANGUAGE "SimpChinese"
; 安装预释放文件
!insertmacro MUI_RESERVEFILE_INSTALLOPTIONS


!define CheckPath "!insertmacro _CheckPath"

!macro _CheckPath _pszPath _bState
    Push `${_pszPath}`
    ${CallArtificialFunction} _CheckPath_Call
    Pop ${_bState}
!macroend

!macro _CheckPath_Call
    Exch $R0
    Push $R1
    Push $R2
    System::Call `shlwapi::PathGetDriveNumber(tR0)i.R1`
    IntCmp $R1 -1 lbl_disable
    System::Call `shlwapi::PathBuildRoot(t.R2,iR1)`
lbl_loop:
    StrCpy $R1 $R0 1 -1
    StrCmp $R1 "\" 0 +3
    StrCpy $R0 $R0 -1
    Goto lbl_loop
    System::Call `shlwapi::PathAddBackslash(tR0R0)`
    System::Call `shlwapi::PathIsRoot(tR0)i.R1`
    IntCmp $R1 1 lbl_disable
    System::Call `kernel32::GetDiskFreeSpaceEx(tR2,*l.R1,*l,*l)`
    System::Int64Op $R1 < 50000000
    Pop $R1
lbl_disable:
    IntOp $R0 $R1 !
    Pop $R2
    Pop $R1
    Exch $R0
!macroend

RequestExecutionLevel admin  ;如果是win7的话还要管理员身份
; ------ MUI 现代界面定义结束 ------

Name "${PRODUCT_NAME} ${PRODUCT_VERSION}"
OutFile "Setup.exe"
;InstallDir "C:\eastmoney\wealthclt"
InstallDirRegKey HKLM "${PRODUCT_UNINST_KEY}" "UninstallString"
ShowInstDetails show
ShowUnInstDetails show
BrandingText "　东方财富网 www.eastmoney.com"

Var ImageHandle
Var Checkbox1
Var Checkbox2
Var Checkbox3
Var Checkbox1_State
Var Checkbox2_State
Var Checkbox3_State
Var Static_Dir
Var Btn_Next
Var Btn_Change
Var Btn_Link
Var Btn_Use
Var icon
Var Progressbar
Var BGImage
Var SetupBg
#------------------------[ .onInit ]------------------------#
Function .onInit
  ;关闭进程
  Push $R0
  CheckProc:
    Push "Goto.exe"
    ProcessWork::ExistsProcess
    Pop $R0
    IntCmp $R0 0 Done
    MessageBox MB_OKCANCEL|MB_ICONSTOP "安装程序检测到 ${PRODUCT_NAME} 正在运行。$\r$\n$\r$\n点击 “确定” 强制关闭${PRODUCT_NAME}，继续安装。$\r$\n点击 “取消” 退出安装程序。" IDCANCEL Exit
    Push "Goto.exe"
    Processwork::KillProcess
    Sleep 1000
    Goto CheckProc
    Exit:
    Abort
    Done:
    Pop $R0

  InitPluginsDir
	File "/oname=$PLUGINSDIR\ToggleImages.html" "img\ToggleImages.html"
  File "/oname=$PLUGINSDIR\01.png" "img\01.png"
  File "/oname=$PLUGINSDIR\02.png" "img\02.png"
  File "/oname=$PLUGINSDIR\03.png" "img\03.png"
  File "/oname=$PLUGINSDIR\04.png" "img\04.png"
  File "/oname=$PLUGINSDIR\bg.bmp" "img\bg.bmp"
  File "/oname=$PLUGINSDIR\bgstart.bmp" "img\bgstart.bmp"
  File "/oname=$PLUGINSDIR\windowBkSetup.bmp" "img\windowBkSetup.bmp"
  File "/oname=$PLUGINSDIR\setup.bmp" "img\setup.bmp"
  File "/oname=$PLUGINSDIR\more.bmp" "img\more.bmp"
  File "/oname=$PLUGINSDIR\windowBk.bmp" "img\windowBk.bmp"
  File "/oname=$PLUGINSDIR\bgfinish.bmp" "img\bgfinish.bmp"
  File "/oname=$PLUGINSDIR\use.bmp" "img\use.bmp"
  File "/oname=$PLUGINSDIR\Progress.bmp" "img\Progress.bmp"
  File "/oname=$PLUGINSDIR\ProgressBar.bmp" "img\ProgressBar.bmp"
  File "/oname=$PLUGINSDIR\close.bmp" "img\close.bmp"
  File "/oname=$PLUGINSDIR\small.bmp" "img\small.bmp"
  File "/oname=$PLUGINSDIR\linkbutton.bmp" "img\linkbutton.bmp"
  File "/oname=$PLUGINSDIR\CloseUnavailable.bmp" "img\CloseUnavailable.bmp"
  File "/oname=$PLUGINSDIR\checkbox_check.bmp" "img\checkbox_check.bmp"
  File "/oname=$PLUGINSDIR\checkbox_nocheck.bmp" "img\checkbox_nocheck.bmp"
  File "/oname=$PLUGINSDIR\setuptext.bmp" "img\setuptext.bmp"
  File "/oname=$PLUGINSDIR\setupfade.bmp" "img\setupfade.bmp"
  SkinBtn::Init "$PLUGINSDIR\setup.bmp"
  SkinBtn::Init "$PLUGINSDIR\more.bmp"
  SkinBtn::Init "$PLUGINSDIR\use.bmp"
  SkinBtn::Init "$PLUGINSDIR\close.bmp"
  SkinBtn::Init "$PLUGINSDIR\small.bmp"
  SkinBtn::Init "$PLUGINSDIR\linkbutton.bmp"
  SkinBtn::Init "$PLUGINSDIR\CloseUnavailable.bmp"
  SkinBtn::Init "$PLUGINSDIR\checkbox_check.bmp"
  SkinBtn::Init "$PLUGINSDIR\checkbox_nocheck.bmp"
FunctionEnd
#-----------------------------------------------------------#
Function myGuiInit

StrCpy $INSTDIR "${PRODUCT_DEFAULT_PATH}"
#SkinSE_NSIS::setskinpath /NOUNLOAD "$PLUGINSDIR\Thunder7.zip"
;System::Call SkinSE::SkinSE_Button_EnableSkin(i0)
	
;消除边框
#System::Call `user32::SetWindowLong(i$HWNDPARENT,i${GWL_STYLE},0x9480084C)i.R0`
System::Call `user32::SetWindowLong(i$HWNDPARENT,i${GWL_STYLE},i2148139282)i.R0`
;隐藏一些既有控件
GetDlgItem $0 $HWNDPARENT 1034
ShowWindow $0 ${SW_HIDE}
GetDlgItem $0 $HWNDPARENT 1035
ShowWindow $0 ${SW_HIDE}
GetDlgItem $0 $HWNDPARENT 1036
ShowWindow $0 ${SW_HIDE}
GetDlgItem $0 $HWNDPARENT 1037
ShowWindow $0 ${SW_HIDE}
GetDlgItem $0 $HWNDPARENT 1038
ShowWindow $0 ${SW_HIDE}
GetDlgItem $0 $HWNDPARENT 1039
ShowWindow $0 ${SW_HIDE}
GetDlgItem $0 $HWNDPARENT 1256
ShowWindow $0 ${SW_HIDE}
GetDlgItem $0 $HWNDPARENT 1028
ShowWindow $0 ${SW_HIDE}

FunctionEnd

;处理无边框移动
Function onGUICallback
  ${If} $MSG = ${WM_LBUTTONDOWN}
    SendMessage $HWNDPARENT ${WM_NCLBUTTONDOWN} ${HTCAPTION} $0
  ${EndIf}
FunctionEnd

#-----------------------------------------------------------#
Function test2
  GetDlgItem $0 $HWNDPARENT 1
  ShowWindow $0 ${SW_HIDE}
  EnableWindow $0 0           ;禁用
  GetDlgItem $0 $HWNDPARENT 2
  ShowWindow $0 ${SW_HIDE}
  GetDlgItem $1 $HWNDPARENT 3
  ShowWindow $1 ${SW_HIDE}
  
	nsDialogs::Create /NOUNLOAD 1018
	  Pop $0
	${If} $0 == error
		Abort
	${EndIf}

	StrCpy  $Checkbox2_State 1
	StrCpy  $Checkbox3_State 1

	#SetCtlColors $0 ""  transparent ;背景设成透明  
	${NSW_SetWindowSize} $HWNDPARENT 479 292 ;改变窗体大小 

	
  ${NSD_CreateDirRequest} 35 152 323 25 $INSTDIR
	   Pop $Static_Dir
	GetFunctionAddress $0 OnDirRequestChange 
	nsDialogs::OnChange $Static_Dir $0
	CreateFont $R1 "Arial" 12 0  ;安装目录选择页面 字体
    SendMessage $Static_Dir ${WM_SETFONT} $R1 0
	

/*	${NSD_CreateCheckbox} 35 255 16 16 ""
	   Pop $Checkbox1
	   ${NSD_Check} $Checkbox1
	   ${NSD_SetState} $Checkbox1 1
   ${NSD_OnClick} $Checkbox1 onCheckbox1 */
   
   	${NSD_CreateButton} 35 253 16 16 ""
	Pop $Checkbox1
    SkinBtn::Set /IMGID=$PLUGINSDIR\checkbox_check.bmp $Checkbox1
	StrCpy $Checkbox1_State 1
    GetFunctionAddress $3 onCheckbox1
	SkinBtn::onClick $Checkbox1 $3
	   
 /* ${NSD_CreateLabel} 52 255 30u 10u "我同意"
     Pop $0
     SetCtlColors $0 "" transparent */
	
	${NSD_CreateButton} 88 255 71 13 ""
	Pop $Btn_Link
    StrCpy $1 $Btn_Link
    Call SkinBtn_Link
    GetFunctionAddress $3 OnLink
	SkinBtn::onClick $1 $3
	
   	${NSD_CreateButton} 35 216 16 16 ""
	Pop $Checkbox2
    SkinBtn::Set /IMGID=$PLUGINSDIR\checkbox_check.bmp $Checkbox2
	StrCpy $Checkbox2_State 1
    GetFunctionAddress $3 onCheckbox2
	SkinBtn::onClick $Checkbox2 $3
		
 /* ${NSD_CreateLabel} 52 218 40u 10u "开始菜单"
     Pop $0
     SetCtlColors $0 "" transparent */
	  
   	${NSD_CreateButton} 126 216 16 16 ""
	Pop $Checkbox3
    SkinBtn::Set /IMGID=$PLUGINSDIR\checkbox_check.bmp $Checkbox3
	StrCpy $Checkbox3_State 1
    GetFunctionAddress $3 onCheckbox3
	SkinBtn::onClick $Checkbox3 $3   

	 #下一步
 ${NSD_CreateButton} 312 235 134 42 ""
	  #SetCtlColors $0 "0x0C4E7C" transparent
	  #${NSD_SetImage} $0 $PLUGINSDIR\setup.bmp $ImageHandle
	   #SkinBtn::Set /IMGID=$PLUGINSDIR\setup.bmp $0
	 #${NSD_OnClick} $0 OnDirRequest
	      Pop $Btn_Next
        StrCpy $1 $Btn_Next
        Call SkinBtn_Next
        GetFunctionAddress $3 SetupNext
    SkinBtn::onClick $1 $3
	EnableWindow $Btn_Next 1
	  
	  #更多路径
	 ${NSD_CreateButton} 358 152 88 25 ""
	  #SetCtlColors $0 "0x0C4E7C" transparent
	  #${NSD_SetImage} $0 $PLUGINSDIR\setup.bmp $ImageHandle
	  	Pop $Btn_Change
        StrCpy $1 $Btn_Change
        Call SkinBtn_Change
        GetFunctionAddress $3 OnDirRequest
	   SkinBtn::onClick $1 $3
	   
	  #最小化
		${NSD_CreateButton} 448 5 8 8 ""
	      Pop $0
        SkinBtn::Set /IMGID=$PLUGINSDIR\small.bmp $0
        GetFunctionAddress $3 onMin
		SkinBtn::onClick $0 $3
	  #关闭
	    ${NSD_CreateButton} 465 5 8 8 ""
	      Pop $0
        SkinBtn::Set /IMGID=$PLUGINSDIR\close.bmp $0
        GetFunctionAddress $3 onClose
		SkinBtn::onClick $0 $3
		
	 ;贴背景大图
	${NSD_CreateBitmap} 0 0 100% 100% ""
	Pop $BGImage
	${NSD_SetImage} $BGImage $PLUGINSDIR\bgstart.bmp $ImageHandle
	GetFunctionAddress $0 onGUICallback
    WndProc::onCallback $BGImage $0 ;处理无边框窗体移动
	nsDialogs::Show
	${NSD_FreeImage} $ImageHandle
FunctionEnd
#-----------------------------------------------------------#

Function OnDirRequestChange
   ${NSD_GetText} $Static_Dir $4
   StrCpy $INSTDIR $4
   
    ${CheckPath} $INSTDIR $6
	EnableWindow $Btn_Next $6
	
/*	${NSD_GetText} $Static_Dir $6   ;获取控件文本状态，这里是指安装目录框的文字，也就是安装路径。
    ${GetRoot} $6 $R3   ;获取安装根目录
    StrCpy $R0 "$R3\"
    StrCpy $R1 "invalid"
    ${GetDrives} "ALL" "HDDDetection"            ;获取将要安装的根目录磁盘类型
${If} $R1 == HDD              ;是硬盘
      EnableWindow $Btn_Next 1
${Else}
    EnableWindow $Btn_Next 0
 ${endif}} */
FunctionEnd

Function onCheckbox1

	${If} $Checkbox1_State == 0
	 SkinBtn::Set /IMGID=$PLUGINSDIR\checkbox_check.bmp $Checkbox1
     StrCpy $Checkbox1_State 1
	${ElseIf} $Checkbox1_State == 1
	  SkinBtn::Set /IMGID=$PLUGINSDIR\checkbox_nocheck.bmp $Checkbox1
	  StrCpy $Checkbox1_State 0
	${EndIf}
	
	EnableWindow $Btn_Next $Checkbox1_State
FunctionEnd

Function onCheckbox2
	${If} $Checkbox2_State == 0
	 SkinBtn::Set /IMGID=$PLUGINSDIR\checkbox_check.bmp $Checkbox2
     StrCpy $Checkbox2_State 1
	${ElseIf} $Checkbox2_State == 1
	  SkinBtn::Set /IMGID=$PLUGINSDIR\checkbox_nocheck.bmp $Checkbox2
	  StrCpy $Checkbox2_State 0
	${EndIf}
FunctionEnd

Function onCheckbox3
	${If} $Checkbox3_State == 0
	 SkinBtn::Set /IMGID=$PLUGINSDIR\checkbox_check.bmp $Checkbox3
     StrCpy $Checkbox3_State 1
	${ElseIf} $Checkbox3_State == 1
	  SkinBtn::Set /IMGID=$PLUGINSDIR\checkbox_nocheck.bmp $Checkbox3
	  StrCpy $Checkbox3_State 0
	${EndIf}
FunctionEnd

#最小化
Function onMin
	#MessageBox MB_OK "sec1"
	SendMessage $HWNDPARENT ${WM_SYSCOMMAND} 0xF020 0
	#SendMessage $HWNDPARENT $112 61472 0 
FunctionEnd

#关闭
Function onClose
	#MessageBox MB_OK "sec1"
	SendMessage $HWNDPARENT ${WM_CLOSE} 0 0
	 #fct::fct /WC '${WND_CLASS}' /WTP '${TITLE_PART}' /TIMEOUT 0 /QUESTION "123"
	
	/*FindProcDLL::FindProc $R0
    Pop $R0
    ${If} $R0 != 0
    KillProcDLL::KillProc $R0
    ${EndIf}*/
FunctionEnd

Function SkinBtn_Next
  SkinBtn::Set /IMGID=$PLUGINSDIR\setup.bmp $1
FunctionEnd

Function SkinBtn_Link
  SkinBtn::Set /IMGID=$PLUGINSDIR\linkbutton.bmp $1
FunctionEnd

Function SkinBtn_Use
  SkinBtn::Set /IMGID=$PLUGINSDIR\use.bmp $1
FunctionEnd

Function SkinBtn_Change
  SkinBtn::Set /IMGID=$PLUGINSDIR\more.bmp $1
FunctionEnd



#-----------------------------------------------------------#
Function AlterButton
   StrCpy $R9 1
   Call RelGotoPage
   Abort
FunctionEnd

Function RelGotoPage
  IntCmp $R9 0 0 Move Move
    StrCmp $R9 "X" 0 Move
      StrCpy $R9 "120"
  Move:
  SendMessage $HWNDPARENT "0x408" "$R9" ""
FunctionEnd

Function Use
   Exec "$INSTDIR\Goto.exe"
   Call AlterButton
FunctionEnd

Function SetupNext
  ${NSD_GetText} $Static_Dir $4
   StrCpy $INSTDIR $4
  
   Call AlterButton
	
   
FunctionEnd

Function onLink
  ExecShell open "http://js1.eastmoney.com/tg.aspx?ID=1877"
FunctionEnd


#-----------------------------------------------------------#
Function OnDirRequest
	nsDialogs::SelectFolderDialog /NOUNLOAD "$\n请选择目录" $INSTDIR


	   Pop $0
	${If} $0 != error
     ${NSD_SetText} $Static_Dir $0
	${EndIf}
FunctionEnd
#-----------------------------------------------------------#
Function onicon
	 Pop $icon
   ShowWindow $icon ${SW_HIDE}
FunctionEnd
#-----------------------------------------------------------#

Function test3

  GetDlgItem $0 $HWNDPARENT 2 ;取消 按钮
  EnableWindow $0 1           ;启用
  
  ${NSW_SetWindowSize} $HWNDPARENT 479 363 ;改变窗体大小 

  FindWindow $0 "#32770" "" $HWNDPARENT
  GetDlgItem $R0 $0 1045
  ShowWindow $R0 ${SW_HIDE}
  GetDlgItem $R0 $0 8012
  ShowWindow $R0 ${SW_HIDE}
  GetDlgItem $R0 $0 1006
  ShowWindow $R0 ${SW_HIDE}
  GetDlgItem $R0 $0 1027
  ShowWindow $R0 ${SW_HIDE}
  GetDlgItem $R0 $0 1016
  ShowWindow $R0 ${SW_HIDE}
  
  System::Call `*(i,i,i,i)i(0,125,479,127).R0`
  System::Call `user32::MapDialogRect(i$HWNDPARENT,iR0)`
  System::Call `*$R0(i.s,i.s,i.s,i.s)`
  System::Free $R0
  FindWindow $R0 "#32770" "" $HWNDPARENT
  System::Call `user32::CreateWindowEx(i,t"STATIC",in,i0x50010000,i0,i125,i479,i207,iR0,i400,in,in)i.R0`
  WebCtrl::ShowWebInCtrl $R0 "$PLUGINSDIR/ToggleImages.html"

  GetDlgItem $SetupBG $0 8008
  
    FindWindow $0 "#32770" "" $HWNDPARENT
  GetDlgItem $Progressbar $0 1004  
  SkinProgress::Set $Progressbar "$PLUGINSDIR\Progress.bmp" "$PLUGINSDIR\ProgressBar.bmp"
  ${NSW_SetWindowPos} $Progressbar 0 353
  ${NSW_SetWindowSize} $Progressbar 479 10
  
  FindWindow $0 "#32770" "" $HWNDPARENT
  GetDlgItem $R0 $0 8010
 
  ${NSW_SetWindowPos} $R0 448 5 
  ${NSW_SetWindowSize} $R0 8 8
  
  SkinBtn::Set /IMGID=$PLUGINSDIR\small.bmp $R0
  GetFunctionAddress $3 onMin
  SkinBtn::onClick $R0 $3
	
  FindWindow $0 "#32770" "" $HWNDPARENT
  GetDlgItem $R0 $0 8011
 
  ${NSW_SetWindowPos} $R0 465 5 
  ${NSW_SetWindowSize} $R0 8 8
	  
  SkinBtn::Set /IMGID=$PLUGINSDIR\CloseUnavailable.bmp $R0
  #GetFunctionAddress $3 onClose
  #SkinBtn::onClick $R0 $3
  
  System::Call `*(i,i,i,i)i(0,0,479,316).R0`
  System::Call `user32::MapDialogRect(i$HWNDPARENT,iR0)`
  System::Call `*$R0(i.s,i.s,i.s,i.s)`
  System::Free $R0
   FindWindow $R0 "#32770" "" $HWNDPARENT
   System::Call 'User32::CreateWindowEx(i0,t"STATIC",i0,i0x50020100,is,is,is,is,i$R0,i8009,i0,i0)i.R1'
   SetCtlColors $R1 "" transparent
  GetFunctionAddress $R1 MoveUI
  ButtonEvent::AddEventHandler /NOUNLOAD 8009 $R1
 

  FindWindow $0 "#32770" "" $HWNDPARENT
  GetDlgItem $R0 $0 8013
 ${NSW_SetWindowPos} $R0 0 332
  ${NSW_SetWindowSize} $R0 479 21
  ${NSD_SetImage} $R0 "$PLUGINSDIR\setuptext.bmp" $ImageHandle
  
 ${NSW_SetWindowPos} $SetupBG 0 0
  ${NSW_SetWindowSize} $SetupBG 479 332
  ${NSD_SetImage} $SetupBG "$PLUGINSDIR\setupfade.bmp" $ImageHandle
  
	
FunctionEnd

Function un.test3

${NSW_SetWindowSize} $HWNDPARENT 501 396 ;改变窗体大小 
FindWindow $0 "#32770" "" $HWNDPARENT
#GetDlgItem $R0 $0 8008
#ShowWindow $R0 ${SW_HIDE}
GetDlgItem $R0 $0 8010
ShowWindow $R0 ${SW_HIDE}
GetDlgItem $R0 $0 8011
ShowWindow $R0 ${SW_HIDE}
  
  GetDlgItem $R0 $HWNDPARENT 1
  ${NSW_SetWindowPos} $R0 381 336
  GetDlgItem $R0 $HWNDPARENT 2
  ShowWindow $R0 ${SW_HIDE}
  GetDlgItem $R0 $HWNDPARENT 3
  ShowWindow $R0 ${SW_HIDE}

  FindWindow $0 "#32770" "" $HWNDPARENT
  GetDlgItem $R0 $0 8012
  SendMessage $R0 ${WM_SETTEXT} 0 "STR:“${PRODUCT_NAME} ${PRODUCT_VERSION}” 正在卸载，请稍后..."  
  ${NSW_SetWindowPos} $R0 40 25
  ${NSW_SetWindowSize} $R0 360 20
  SetCtlColors $R0 "0x000000"  "0xFFFFFF"
  
    GetDlgItem $SetupBG $0 8008
 
 ${NSW_SetWindowPos} $SetupBG 0 0
  ${NSW_SetWindowSize} $SetupBG 501 59
  ${NSD_SetImage} $SetupBG "$PLUGINSDIR\uninstall.bmp" $ImageHandle
FunctionEnd

Function MoveUI
SendMessage $HWNDPARENT ${wm_SysCommand} 0xF011 $R1
FunctionEnd

Function NSD_Timer.Callback
    ${NSD_KillTimer} NSD_Timer.Callback ; 关闭定时器
	
	#Sleep 1000
	#fCall Setup
	Call AlterButton
FunctionEnd

Function test4

  GetDlgItem $0 $HWNDPARENT 1
  ShowWindow $0 ${SW_HIDE}
  EnableWindow $0 0           ;禁用
  
SendMessage $HWNDPARENT ${WM_SYSCOMMAND} 0xF120 0

${NSW_SetWindowSize} $HWNDPARENT 479 268 ;改变窗体大小 
  #GetDlgItem $0 $HWNDPARENT 2
  #System::Call 'user32::SetWindowPos(i$0,i0,i0,i0,i0,i0,i0x00000080)'
  #GetDlgItem $1 $HWNDPARENT 1
  #System::Call 'user32::SetWindowPos(i$1,i0,i413,i333,i87,i27,i0x00000040)'
  #SendMessage $1 ${WM_SETTEXT} 0 "STR:完成"
  

  GetDlgItem $0 $HWNDPARENT 2 ;取消 按钮
  EnableWindow $0 1           ;启用
	
  GetDlgItem $0 $HWNDPARENT 1
  ShowWindow $0 ${SW_HIDE}
  GetDlgItem $0 $HWNDPARENT 2
  ShowWindow $0 ${SW_HIDE}
  GetDlgItem $1 $HWNDPARENT 3
  ShowWindow $1 ${SW_HIDE}
  
	nsDialogs::Create /NOUNLOAD 1018
	  Pop $0
	${If} $0 == error
		Abort
	${EndIf}
     
#立即体验
 ${NSD_CreateButton} 157 173 165 48 ""
	      Pop $Btn_Use
        StrCpy $1 $Btn_Use
        Call SkinBtn_Use
        GetFunctionAddress $3 Use
    SkinBtn::onClick $1 $3
	
		  #最小化
		${NSD_CreateButton} 448 5 8 8 ""
	      Pop $0
        SkinBtn::Set /IMGID=$PLUGINSDIR\small.bmp $0
        GetFunctionAddress $3 onMin
		SkinBtn::onClick $0 $3
	  #关闭
	    ${NSD_CreateButton} 465 5 8 8 ""
	      Pop $0
        SkinBtn::Set /IMGID=$PLUGINSDIR\close.bmp $0
        GetFunctionAddress $3 onClose
		SkinBtn::onClick $0 $3
		
	 ;贴背景大图
	${NSD_CreateBitmap} 0 0 100% 100% ""
	Pop $BGImage
	${NSD_SetImage} $BGImage $PLUGINSDIR\bgfinish.bmp $ImageHandle
	 GetFunctionAddress $0 onGUICallback
    WndProc::onCallback $BGImage $0 ;处理无边框窗体移动
	#System::Call S	kinSE::SkinSE_Init(i$HWNDPARENT,i1)
	nsDialogs::Show
	${NSD_FreeImage} $ImageHandle
	
FunctionEnd

#-----------------------------------------------------------#

#-----------------------------------------------------------#

Section Main

  SetOutPath "$INSTDIR"
  SetOverwrite ON 
  File "..\Goto.exe"
  File "..\Goto.exe.manifest"
  File "..\goto.xml"
  File "..\GT.dll"
  File "..\mohuyin.ini"
  File "..\pad.xml"
  File "..\UILite.dll"
  File "..\SHGotoHelper.dll"
  File "..\pinyin.py"
  File "..\uninst.exe"

  SetOutPath "$INSTDIR"
  SetOverwrite ON
  File /r "..\ext"
 
  SetOutPath "$INSTDIR"
  SetOverwrite ON
  File /r "..\Microsoft.VC90.CRT"
  
  SetOutPath "$INSTDIR"
  SetOverwrite ON
  File /r "..\Microsoft.VC90.OPENMP"
  
  SetOutPath "$INSTDIR"
  SetOverwrite ON
  File /r "..\skin"
   
  SetOutPath "$INSTDIR"
  
  RMDir /r "$SMPROGRAMS\${PRODUCT_NAME}\data"
  
  ReadRegStr $R0 HKLM "SOFTWARE\Microsoft\Windows NT\CurrentVersion" "CurrentVersion"
  
  #${If} $Checkbox3_State == 1
  #		CreateShortCut "$DESKTOP\${SHORTCUT_NAME}.lnk" "$INSTDIR\Goto.exe" "" "$INSTDIR\trade\res\dongcai.ico"
  #${EndIf}
  
  ${If} $Checkbox2_State == 1
  CreateDirectory "$SMPROGRAMS\${PRODUCT_NAME}"
  CreateShortCut "$SMPROGRAMS\${PRODUCT_NAME}\1_${PRODUCT_NAME}.lnk" "$INSTDIR\Goto.exe" "Goto" "$INSTDIR\trade\res\dongcai.ico"
  CreateShortCut "$SMPROGRAMS\${PRODUCT_NAME}\2_进入安装目录.lnk" "$INSTDIR\" "" ""
  CreateShortCut "$SMPROGRAMS\${PRODUCT_NAME}\3_卸载${PRODUCT_NAME}.lnk" "$INSTDIR\uninst.exe" "" "$INSTDIR\trade\res\modern-uninstall.ico"
  ${EndIf}
  
  ${If} $Checkbox3_State == 1
  	${if} $R0 >= 6.0
	    SetOutPath "$INSTDIR"
		#CreateShortCut "$INSTDIR\${SHORTCUT_NAME}.lnk" "$INSTDIR\Goto.exe"
		#SetOutPath $WINDIR
		#ExecShell taskbarunpin "$DESKTOP\${SHORTCUT_NAME}.lnk"
		Delete "$DESKTOP\${SHORTCUT_NAME}.lnk"
		CreateShortCut "$DESKTOP\${SHORTCUT_NAME}.lnk" "$INSTDIR\Goto.exe" "EmTrade" "$INSTDIR\trade\res\dongcai.ico"
		#ExecShell taskbarpin "$DESKTOP\${SHORTCUT_NAME}.lnk"
	 ${else}
		  Delete "$DESKTOP\${SHORTCUT_NAME}.lnk"
		  CreateShortCut "$DESKTOP\${SHORTCUT_NAME}.lnk" "$INSTDIR\Goto.exe"
		  CreateShortCut "$QUICKLAUNCH\${PRODUCT_NAME}.lnk" "$INSTDIR\Goto.exe"
	  ${EndIf}
  ${EndIf}

 


  WriteUninstaller "$INSTDIR\uninst.exe"
  WriteRegStr HKLM "${PRODUCT_DIR_REGKEY}" "" "$INSTDIR\Goto.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayName" "$(^Name)"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "UninstallString" "$INSTDIR\uninst.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayIcon" "$INSTDIR\GOTO.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayVersion" "${PRODUCT_VERSION}"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "URLInfoAbout" "${PRODUCT_WEB_SITE}"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "Publisher" "${PRODUCT_PUBLISHER}"

  GetDlgItem  $5 $HWNDPARENT  1
  EnableWindow $5 1
  SendMessage $5 ${BM_CLICK} 0 0
  SectionEnd

Section Uninstall

  Delete "$INSTDIR\Goto.exe"
  Delete "$INSTDIR\Goto.exe.manifest"
  Delete "$INSTDIR\goto.xml"
  Delete "$INSTDIR\GT.dll"
  Delete "$INSTDIR\mohuyin.ini"
  Delete "$INSTDIR\pad.xml"
  Delete "$INSTDIR\UILite.dll"
  Delete "$INSTDIR\SHGotoHelper.dll"
  Delete "$INSTDIR\pinyin.py"
  
  RMDIR /r "$INSTDIR\ext"
  RMDIR /r "$INSTDIR\Microsoft.VC90.CRT"
  RMDIR /r "$INSTDIR\Microsoft.VC90.OPENMP"
  RMDIR /r "$INSTDIR\skin"
;======================================================
  Delete "$INSTDIR\${PRODUCT_NAME}.url"
  Delete "$INSTDIR\uninst.exe"
  
  
  ReadRegStr $R0 HKLM "SOFTWARE\Microsoft\Windows NT\CurrentVersion" "CurrentVersion"
  ${if} $R0 >= 6.0
    ExecShell taskbarunpin "$DESKTOP\${SHORTCUT_NAME}.lnk"
	#Delete "$INSTDIR\${SHORTCUT_NAME}.lnk"
  ${else}
	Delete "$QUICKLAUNCH\${PRODUCT_NAME}.lnk"
  ${Endif}
  
  Delete "$DESKTOP\${SHORTCUT_NAME}.lnk"
  
  
  Delete "$SMPROGRAMS\${PRODUCT_NAME}\1_${PRODUCT_NAME}.lnk"
  Delete "$SMPROGRAMS\${PRODUCT_NAME}\2_进入安装目录.lnk"
  Delete "$SMPROGRAMS\${PRODUCT_NAME}\3_卸载${PRODUCT_NAME}.lnk"

  RMDir "$SMPROGRAMS\${PRODUCT_NAME}"

  RMDir "$INSTDIR"

  ; 判断系统是64位或者32位，删除注册表中的卸载信息
  !include "x64.nsh"
  ${If} ${RunningX64}
     !define PRODUCT_UNINST_KEY64 "Software\Wow6432Node\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}"
     DeleteRegKey ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY64}"
     DeleteRegKey HKLM "${PRODUCT_DIR_REGKEY}"
  ${Else}
     DeleteRegKey ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}"
     DeleteRegKey HKLM "${PRODUCT_DIR_REGKEY}"
  ${EndIf}

  SetAutoClose true
SectionEnd

Function un.onInit
  ;检测程序是否运行,关闭进程
  Push $R0
  CheckProc:
    Push "Goto.exe"
    ProcessWork::ExistsProcess
    Pop $R0
    IntCmp $R0 0 Done
    MessageBox MB_OKCANCEL|MB_ICONSTOP "卸载程序检测到 ${PRODUCT_NAME} 正在运行。$\r$\n$\r$\n点击 “确定” 强制关闭${PRODUCT_NAME}，继续卸载。$\r$\n点击 “取消” 退出安装程序。" IDCANCEL Exit
    Push "Goto.exe"
    Processwork::KillProcess
    Sleep 1000
    Goto CheckProc
    Exit:
    Abort
    Done:
    Pop $R0

 InitPluginsDir  
  File "/oname=$PLUGINSDIR\uninstall.bmp" "img\uninstall.bmp"
  MessageBox MB_ICONQUESTION|MB_YESNO|MB_DEFBUTTON2 "您确实要完全移除 $(^Name) ，及其所有的组件？" IDYES +2
  Abort
FunctionEnd

Function un.onUninstSuccess
  HideWindow
  MessageBox MB_ICONINFORMATION|MB_OK "$(^Name) 已成功地从你的计算机移除。"
  ExecShell "open" "http://www.eastmoney.com/"
FunctionEnd