package com.skynet.vmall.author.login.action;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.nutz.dao.Cnd;
import org.nutz.ioc.loader.annotation.Inject;
import org.nutz.ioc.loader.annotation.IocBean;
import org.nutz.lang.util.NutMap;
import org.nutz.log.Log;
import org.nutz.log.Logs;
import org.nutz.mvc.Mvcs;
import org.nutz.mvc.annotation.At;
import org.nutz.mvc.annotation.Ok;
import org.nutz.mvc.annotation.Param;

import com.skynet.app.organ.service.GroupUserService;
import com.skynet.app.organ.service.OrganService;
import com.skynet.app.organ.service.UserService;
import com.skynet.framework.action.BaseAction;
import com.skynet.framework.services.db.dybeans.DynamicObject;
import com.skynet.framework.spec.GlobalConstants;
import com.skynet.vmall.member.service.MemberService;
import com.skynet.vmall.wx.action.WXActionHelper;

@IocBean
@At("/author/login")
public class LoginAction extends BaseAction
{
	private Log log = Logs.getLog(LoginAction.class);
	
	@Inject
	WXActionHelper myWxHelper;
	
	@Inject
	private OrganService organService;

	@Inject
	private UserService userService;

	@Inject
	private GroupUserService groupuserService;
	
	@Inject
	private MemberService memberService;

	@At("/wxlogin")
	@Ok(">>:/mall/mall/index.action")
	public NutMap wxlogin(String info, HttpServletRequest req) throws Exception
	{
		// 清除现有会话信息
		HttpSession session = Mvcs.getHttpSession(true);
		session.removeAttribute(GlobalConstants.sys_login_token);
		
		NutMap mapwx = myWxHelper.wx_minfo(info, req);
		String newwxopenid = (String)mapwx.get("openid"); // 当前会员
		String oldwxopenid = (String)mapwx.get("recommender");// 推荐会员 

		DynamicObject obj = memberService.newwxuser(oldwxopenid, newwxopenid);
		
		session.setAttribute(GlobalConstants.sys_login_token, obj);	
		session.setAttribute(GlobalConstants.sys_wxinfo, info);			
		return mapwx;
	}
	
	@At("/login_test")
	@Ok(">>:/mall/mall/index_test.action")
	public Map login_test(@Param("username") String loginname, String password) throws Exception
	{
		HttpSession session = Mvcs.getHttpSession(true);
		session.removeAttribute(GlobalConstants.sys_login_token);

		int num = userService.count(Cnd.where("loginname", "=", loginname).and("password", "=", password));
		
		if (num==0)
		{
			session.removeAttribute(GlobalConstants.sys_login_token);
			ro.put("status", "failed");
			return ro;
		}
		
		DynamicObject user = userService.locateBy(Cnd.where("loginname", "=", loginname).and("password", "=", password));

		DynamicObject dept = userService.getPrimaryDept(loginname);
		DynamicObject org = userService.getPrimaryOrg(loginname);

		DynamicObject obj = new DynamicObject();
		obj.setAttr(GlobalConstants.sys_login_user, loginname);
		obj.setAttr(GlobalConstants.sys_login_username, user.getFormatAttr("cname"));
		obj.setAttr(GlobalConstants.sys_login_userid, user.getFormatAttr("id"));
		obj.setAttr(GlobalConstants.sys_login_userwxopenid, user.getFormatAttr("wxopenid"));

		obj.setAttr(GlobalConstants.sys_login_dept, dept.getFormatAttr("id"));
		obj.setAttr(GlobalConstants.sys_login_deptname, dept.getFormatAttr("cname"));
		obj.setAttr(GlobalConstants.sys_login_dept_internal, dept.getFormatAttr("internal"));

		obj.setAttr(GlobalConstants.sys_login_org, org.getFormatAttr("id"));
		obj.setAttr(GlobalConstants.sys_login_orgname, org.getFormatAttr("cname"));
		obj.setAttr(GlobalConstants.sys_login_org_internal, org.getFormatAttr("internal"));

		session.setAttribute(GlobalConstants.sys_login_token, obj);

		return ro;
	}
	
	public OrganService getOrganService()
	{
		return organService;
	}

	public void setOrganService(OrganService organService)
	{
		this.organService = organService;
	}

	public UserService getUserService()
	{
		return userService;
	}

	public void setUserService(UserService userService)
	{
		this.userService = userService;
	}

	public GroupUserService getGroupuserService()
	{
		return groupuserService;
	}

	public void setGroupuserService(GroupUserService groupuserService)
	{
		this.groupuserService = groupuserService;
	}
	
	

}
