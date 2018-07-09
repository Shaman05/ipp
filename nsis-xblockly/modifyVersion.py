#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Author: liangxi
# @Date:   2017-01-20 16:34:58
# @desc:   用来自动修改版本号和资源对话框(IDD_DLG_SYS_ABOUTDIALOG)的日期，
#          此脚本未经严格测试，使用后最后手工检查是否修改正确

import re
import datetime

def modifyPackageVersion(tfile,sstr,strVersion):
    try:
        lines=open(tfile,'r').readlines()
        flen=len(lines)-1
        p = re.compile(r"\d+\.\d+\.\d+\.\d+", re.DOTALL)
        for i in range(flen):
            if sstr in lines[i]:
                match = p.sub(strVersion, lines[i])
                lines[i]=match
        open(tfile,'w').writelines(lines)
    except Exception,e:
        print e

def modifyUcfVersion(tfile,sstr,strVersion):
    try:
        lines=open(tfile,'r').readlines()
        flen=len(lines)-1
        p = re.compile(r"\d+\.\d+\.\d+\.\d+", re.DOTALL)
        for i in range(flen):
            if sstr in lines[i]:
                print lines[i]
                match = p.sub(strVersion, lines[i+1])
                print match
                lines[i+1]=match
                break
        open(tfile,'w').writelines(lines)
    except Exception,e:
        print e       

def modifyRcVersion(tfile,strVersion):
    try:
        lines=open(tfile,'r').readlines()
        flen=len(lines)-1
        p = re.compile(r"\d+[\.|\,]\d+[\.|\,]\d+[\.|\,]\d+", re.DOTALL)
        strVersionWithDot = strVersion
        strVersionWithComma = strVersion.replace('.', ',')
        for i in range(flen):
            if "FileVersion" in lines[i] or "ProductVersion" in lines[i]:
                match = p.sub(strVersionWithDot, lines[i])
                lines[i]=match
            if "FILEVERSION" in lines[i] or "PRODUCTVERSION" in lines[i]:
                match = p.sub(strVersionWithComma, lines[i])
                lines[i]=match
        open(tfile,'w').writelines(lines)
    except Exception,e:
        print e

def modifyAboutDlgDate(tfile):
    try:
        lines=open(tfile,'r').readlines()
        flen=len(lines)-1
        findDlg = False
        p = re.compile(r"201\d-\d{1,2}-\d{1,2}", re.DOTALL)
        for i in range(flen):
            if "IDD_DLG_SYS_ABOUTDIALOG" in lines[i]:
                findDlg = True
            if findDlg and "LTEXT           \"2018" in lines[i]:
                now = datetime.datetime.now()
                nowDate = now.strftime("%Y-%m-%d")
                match = p.sub(nowDate, lines[i])
                lines[i] = match
                break
        open(tfile,'w').writelines(lines)
    except Exception,e:
        print e

def ReadVersion(tfile):
    try:
        file_object = open(tfile, 'r')
        lines = file_object.readlines()
        print lines[0]
        return lines[0]
    finally:
        file_object.close( )

if __name__=="__main__":
    version = ReadVersion('version.txt')
    modifyPackageVersion('setup.nsi', '!define PRODUCT_VERSION', version)
    modifyPackageVersion('setupForUninst.nsi', '!define PRODUCT_VERSION', version)
    modifyPackageVersion('update.nsi', '!define PRODUCT_VERSION', version)
    modifyUcfVersion(r'../release/TradeUpdate.ucf', '[VERSION]', version)
    modifyUcfVersion(r'../release/TradeUpdate_dll.ucf', '[VERSION]', version)
    modifyRcVersion(r'../Main/EM.Trade.CMain.Main/EM.Trade.CMain.Main.rc', version)
    modifyAboutDlgDate(r'../Main/EM.Trade.CMain.Main/EM.Trade.CMain.Main.rc')
    modifyUcfVersion(r'../release2/TradeUpdate.ucf', '[VERSION]', version)
    modifyUcfVersion(r'../release2/TradeUpdate_dll.ucf', '[VERSION]', version)