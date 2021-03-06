package com.skynet.vmall.order.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.nutz.dao.Chain;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.ioc.annotation.InjectName;
import org.nutz.ioc.loader.annotation.IocBean;

import com.skynet.framework.service.SkynetNameEntityService;
import com.skynet.framework.services.db.dybeans.DynamicObject;
import com.skynet.framework.services.function.StringToolKit;
import com.skynet.framework.services.function.Types;
import com.skynet.vmall.base.constants.VMallConstants;
import com.skynet.vmall.base.pojo.Order;

@InjectName("orderService")
@IocBean(args =
{ "refer:dao" })
public class OrderService extends SkynetNameEntityService<Order>
{
	public OrderService()
	{
		super();
	}

	public OrderService(Dao dao)
	{
		super(dao);
	}

	public OrderService(Dao dao, Class<Order> entityType)
	{
		super(dao, entityType);
	}

	// 浏览商品
	public List<DynamicObject> browse(Map map) throws Exception
	{
		int page = Types.parseInt((String) map.get("_page"), 1);
		int pagesize = Types.parseInt((String) map.get("_pagesize"), 1);

		int startindex = (page - 1) * pagesize;
		int endindex = page * pagesize;

		StringBuffer sql = new StringBuffer();
		sql.append(" select * from t_app_goods ").append("\n");
		sql.append("  where 1 = 1 ").append("\n");
		// 增加查询过滤条件

		List<DynamicObject> datas = sdao().queryForList(sql.toString(), startindex, endindex);

		return datas;
	}

	// 转发
	public Map forward(String id) throws Exception
	{
		Map map = new DynamicObject();
		DynamicObject order = locate(id);
		String flowstate = order.getFormatAttr("state");

		// 检查流程已结束异常
		if ("结束".equals(flowstate))
		{
			map.put("state", "error");
			map.put("errormessage", "订单流程已结束，不允许再转发处理！");
			return map;
		}

		// 检查未找到当前流程状态异常
		String flownextstate = flowstate;
		int index = StringToolKit.getTextInArrayIndex(VMallConstants.flow_order, flowstate);
		if (index == -1)
		{
			map.put("state", "error");
			map.put("errormessage", "未找到当前流程状态！");
			return map;
		}

		if (VMallConstants.flow_order.length > (index + 1))
		{
			flownextstate = VMallConstants.flow_order[index + 1];
		}

		// 更新状态至下一环节
		sdao().update(Order.class, Chain.make("state", flownextstate), Cnd.where("id", "=", id));
		map.put("state", "success");
		map.put("flownextstate", flownextstate);
		return map;
	}
	
	public Map savetaker(Map map) throws Exception
	{
		Map remap = new HashMap();
		String id =  (String)map.get("id");		
		String takercname = (String)map.get("takercname");
		String takermobile = (String)map.get("takermobile");
		String takeprovince = (String)map.get("takeprovince");
		String takecity = (String)map.get("takecity");
		String takecounty = (String)map.get("takecounty");
		String taketown = (String)map.get("taketown");
		String takepostcode = (String)map.get("takepostcode");
		String takeaddress = (String)map.get("takeaddress");

		if(StringToolKit.isBlank(takercname))
		{
			remap.put("state", "error");
			remap.put("error", "请填写收货人姓名。");
			return remap;
		}
		
		if(StringToolKit.isBlank(takermobile))
		{
			remap.put("state", "error");
			remap.put("error", "请填写收货人联系电话。");
			return remap;
		}
		
		if(StringToolKit.isBlank(takeaddress))
		{
			remap.put("state", "error");
			remap.put("error", "请填写收货地址。");	
			return remap;
		}
		
		Order order = sdao().fetch(Order.class, id);
		if(order==null)
		{
			remap.put("state", "error");
			remap.put("error", "订单信息异常，未找到当前订单。");	
			return remap;			
		}
		
		order.setTakercname(takercname);
		order.setTakermobile(takermobile);
		order.setTakeprovince(takeprovince);
		order.setTakecity(takecity);
		order.setTakecounty(takecounty);
		order.setTaketown(taketown);
		order.setTakepostcode(takepostcode);
		order.setTakeaddress(takeaddress);		
		
		sdao().update(order);
		
		remap.put("state", "success");
		remap.put("order", locate(id));
		
		return remap;	
	}
	
	public Map savemember(Map map) throws Exception
	{
		Map remap = new HashMap();
		String id =  (String)map.get("id");		
		String membercname = (String)map.get("membercname");
		String phone = (String)map.get("phone");
		
		if(StringToolKit.isBlank(membercname))
		{
			remap.put("state", "error");
			remap.put("error", "未填写会员姓名，请检查个人资料后，重新下单。");
			return remap;
		}
		
		if(StringToolKit.isBlank(phone))
		{
			remap.put("state", "error");
			remap.put("error", "请填写购买人联系电话。");
			return remap;
		}

		Order order = sdao().fetch(Order.class, id);
		
		if(order==null)
		{
			remap.put("state", "error");
			remap.put("error", "订单信息异常，未找到当前订单。");	
			return remap;			
		}
		
		String memberid = order.getMemberid();
		String wxopenid = order.getWxopenid();
		
		if(StringToolKit.isBlank(memberid))
		{
			remap.put("state", "error");
			remap.put("error", "会员资料异常，请检查资料后，重新下单。");	
			return remap;
		}
	
		if(StringToolKit.isBlank(wxopenid))
		{
			remap.put("state", "error");
			remap.put("error", "会员未注册微信账号，请检查资料后，重新下单。");	
			return remap;
		}
		
		order.setMembercname(membercname);
		order.setPhone(phone);
		
		sdao().update(order);
		
		remap.put("state", "success");
		remap.put("order", locate(id));
		
		return remap;	
	}
	
	

}
