package io.guaong.restaurant;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.http.converter.FormHttpMessageConverter;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.http.converter.xml.MappingJackson2XmlHttpMessageConverter;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.DefaultResponseErrorHandler;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import io.guaong.restaurant.entity.EmployeeInfo;
import io.guaong.restaurant.entity.FoodImage;
import io.guaong.restaurant.entity.FoodInfo;
import io.guaong.restaurant.entity.FoodSales;
import io.guaong.restaurant.entity.FoodType;
import io.guaong.restaurant.entity.OrderInfo;
import io.guaong.restaurant.entity.SelectedFoodInfo;
import io.guaong.restaurant.entity.ShopCar;
import io.guaong.restaurant.entity.Suggest;
import io.guaong.restaurant.entity.UserInfo;
import io.guaong.restaurant.entity.WechatInfo;
import io.guaong.restaurant.entity.WindowInfo;
import io.guaong.restaurant.entity.WindowSales;
import io.guaong.restaurant.entity.WindowSelectedFoodsInfo;
import io.guaong.restaurant.repository.EmployeeInfoRepository;
import io.guaong.restaurant.repository.FoodInfoRepository;
import io.guaong.restaurant.repository.FoodTypeRepository;
import io.guaong.restaurant.repository.OrderInfoRepository;
import io.guaong.restaurant.repository.SuggestRepository;
import io.guaong.restaurant.repository.UserInfoRepository;
import io.guaong.restaurant.repository.WindowInfoRepository;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;

@RestController
@EnableAutoConfiguration
public class FoodInfoController {
	
	public static String url = "http://localhost:8080/";
	public String cacheUrl = "/Users/zhaolutong/develop/restaurant_system/src/main/resources/static/cache";
	public String imagesUrl = "/Users/zhaolutong/develop/restaurant_system/src/main/resources/static/images";
	
	@Autowired
	private FoodInfoRepository mFoodInfoRepository;
	@Autowired
	private WindowInfoRepository mWindowInfoRepository;
	@Autowired
	private UserInfoRepository mUserInfoRepository;
	@Autowired
	private OrderInfoRepository mOrderInfoRepository;
	@Autowired
	private EmployeeInfoRepository mEmployeeInfoRepository;
	@Autowired
	private FoodTypeRepository mFoodTypeRepository;
	@Autowired
	private SuggestRepository mSuggestRepository;
	
	public static void main(String[] args) {
		SpringApplication.run(FoodInfoController.class, args);
	}
	
	@RequestMapping("/start")
	public ModelAndView start(HttpSession session) {
		ModelAndView modelAndView = new ModelAndView();
		modelAndView.setViewName("home");
		System.out.println(session.getAttribute("id")+" this is session");
		return modelAndView;
	}
	
	//用于获取窗口信息
	@RequestMapping("/getWindowInfo")
	public List<WindowInfo> getWindowInfo(){
		return mWindowInfoRepository.findAll();
	}
	
	//获取所有食物信息
	@RequestMapping("/getAllInfo")
	public List<FoodInfo> getAllInfo(){
		return mFoodInfoRepository.findAllOrderByFoodNumber();
	}
	
	//用于获取每个窗口所有菜品信息
	@RequestMapping("/getWindowFoodInfo")
	public List<WindowSelectedFoodsInfo> getWindowFoodInfo(@RequestParam(value = "windowNumber") int windowNumber){
		int no = 0;
		List<WindowSelectedFoodsInfo> windowSelectedFoodsInfos = new ArrayList<>();
		//根据食物类型循环
		final List<String> types = mFoodInfoRepository.getDistinctFoodType(windowNumber);
		final List<FoodInfo> infos = mFoodInfoRepository.findFoodInfoByRestaurantWindowNumber(windowNumber);
		for (String string : types) {
			//存放所属同一类型食物
			final WindowSelectedFoodsInfo foodsInfo = new WindowSelectedFoodsInfo();
			final List<SelectedFoodInfo> selectedFoodInfos = new ArrayList<>();
			for (FoodInfo foodInfo : infos) {
				final SelectedFoodInfo selectedFoodInfo = new SelectedFoodInfo();
				if(string.equals(foodInfo.getFoodType())) {
					selectedFoodInfo.setFoodImgUrl(foodInfo.getFoodImgUrl());
					selectedFoodInfo.setFoodName(foodInfo.getFoodName());
					selectedFoodInfo.setFoodPrice(foodInfo.getFoodPrice());
					selectedFoodInfo.setNo(no);
					selectedFoodInfo.setId(foodInfo.getFoodNumber());
					selectedFoodInfos.add(selectedFoodInfo);
					no++;
				}
			}
			foodsInfo.setFoodType(string);
			foodsInfo.setSelectedFoodInfo(selectedFoodInfos);
			windowSelectedFoodsInfos.add(foodsInfo);
		}
		return windowSelectedFoodsInfos;
	}	
	
	@RequestMapping("/getFoodType")
	public List<FoodType> getFoodType(){
		return mFoodTypeRepository.findAll();
	}
	
	@RequestMapping("/getFoodInfos")
	public List<FoodInfo> getFoodInfos(@RequestParam(value="windowNum") int num){
		return mFoodInfoRepository.findFoodInfoByRestaurantWindowNumber(num);
	}
	
	//用于获取首页上用于展示窗口的图片
	@RequestMapping("/firstImgs")
	List<FoodImage> getFirstImgs() {
		List<FoodImage> restaurantFoodsImageList = new ArrayList<FoodImage>();
		List<Integer> distinctRestaurantWindowsList = mFoodInfoRepository.getDistinctRestaurantWindows();
		for (Integer number : distinctRestaurantWindowsList) {
			List<FoodInfo> mList =  mFoodInfoRepository.findFoodInfoByRestaurantWindowNumber(number);
			FoodImage img = new FoodImage(mList.get(0).getRestaurantWindowNumber()+"", mList.get(0).getFoodImgUrl());
			restaurantFoodsImageList.add(img);
		}
		return restaurantFoodsImageList;
	}
	
	@RequestMapping("/getOrder")
	List<OrderInfo> getOrderInfo(@RequestParam(value="openid") String openid){
		return mOrderInfoRepository.findOrderInfoByOpenid(openid);
	}
	
	@RequestMapping("/getAllOrder")
	List<OrderInfo> getAllOrderInfo(){
		return mOrderInfoRepository.findAll();
	}
	
	@RequestMapping("/getDoingOrder")
	List<OrderInfo> getDoingOrder(@RequestParam(value="openid") String openid){
		List<OrderInfo> infos = mOrderInfoRepository.getDoingOrder(openid);
		return infos;
	}
	
	@RequestMapping("/getWaitingOrder")
	List<OrderInfo> getWaitingOrder(@RequestParam(value="openid") String openid){
		List<OrderInfo> infos = mOrderInfoRepository.getWaitingOrder(openid);
		return infos;
	}
	
	@RequestMapping("/getFinishedOrder")
	List<OrderInfo> getFinishedOrder(@RequestParam(value="openid") String openid){
		List<OrderInfo> infos = mOrderInfoRepository.getFinishedOrder(openid);
		return infos;
	}
	
	@RequestMapping("/getSuggest")
	List<Suggest> getSuggest(){
		return mSuggestRepository.findAll();
	}
	
	@RequestMapping("/getTakeMealCode")
	int getTakeMealCode(@RequestParam(value="openid") String openid, @RequestParam(value="foodNumber") int foodNumber){
		List<OrderInfo> infos = WebSocketServer.orderQueue;
		int code = 1;
		for (OrderInfo orderInfo : infos) {
			if(orderInfo.getFoodNumber() == foodNumber) {
				code++;
				if(orderInfo.getOpenid() == openid) {
					break;
				}
			}
		}
		return code;
	}
	
	@RequestMapping("/getWaittingQueue")
	Map<String, ArrayList<Integer>> getWaittingQueue(@RequestBody ArrayList<Integer> list) {
		ArrayList<Integer> queue = new ArrayList<Integer>();
		Map<String, ArrayList<Integer>> map = new HashMap<String, ArrayList<Integer>>();
		for (Integer i : list) {
			int count = 0;
			for (OrderInfo info : WebSocketServer.orderQueue) {
				if(info.getFoodNumber() == i) {
					count++;
				}
			}
			queue.add(count);
		}
		map.put("queue", queue);
		return map;
	}
	
	@RequestMapping("/getWaitting")
	List<OrderInfo> getWaitting(@RequestParam(value="windowNumber") int number){
		return mOrderInfoRepository.getCurrentWindowWaittingOrder(number);
	}
	
	@RequestMapping("/getDelivered")
	List<OrderInfo> getDelivered(@RequestParam(value="windowNumber") int number){
		return mOrderInfoRepository.getCurrentWindowDeliveredOrder(number);
	}
	
	//用于删除窗口信息
	@RequestMapping("/delWindowInfo")
	public void delWindowInfo(@RequestParam(value="id") long id){
		int delWindowNumber = mWindowInfoRepository.getOne(id).getRestaurantWindowNumber();
		List<FoodInfo> list = mFoodInfoRepository.findFoodInfoByRestaurantWindowNumber(delWindowNumber);
		for (FoodInfo foodInfo : list) {
			mFoodInfoRepository.delete(foodInfo);
		}
		List<WindowInfo> infos = mWindowInfoRepository.findAll();
		mWindowInfoRepository.deleteById(id);
		for(int i = 0; i < infos.size(); i++) {
			int num;
			if((num = infos.get(i).getRestaurantWindowNumber()) > delWindowNumber) {
				infos.get(i).setRestaurantWindowNumber(num-1);
				mWindowInfoRepository.save(infos.get(i));
			}
		}
	}
	
	//用于删除一条菜品信息
	@RequestMapping("/delFoodInfo")
	public void deleteOneFoodInfo(@RequestParam(value = "foodNumber") int foodNumber) {
		deleteFoodInfo(foodNumber);
	}
	
	//删除多条信息
	@RequestMapping("/delFoodInfos")
	public JSONObject deleteFoodInfos(@RequestBody JSONObject json) {
		JSONObject obj = new JSONObject();
		obj.put("msg", "ok");
		Object[] objs = json.getJSONArray("delInfos").toArray();
		for (Object o : objs) {
			deleteFoodInfo(Integer.parseInt((String)o));
		}
		return obj;
	}
	
	@RequestMapping("/delFoodType")
	public void delFoodType(@RequestParam(value="id") long id) {
		String type = mFoodTypeRepository.getOne(id).getName();
		List<FoodInfo> infos = mFoodInfoRepository.findFoodInfoByFoodType(type);
		for (FoodInfo foodInfo : infos) {
			foodInfo.setFoodType("其他");
			mFoodInfoRepository.save(foodInfo);
		}
		FoodType foodType = new FoodType();
		foodType.setName("其他");
		mFoodTypeRepository.save(foodType);
		mFoodTypeRepository.deleteById(id);
	}
	
	//清空
	@RequestMapping("/emptyFoodInfo")
	public void emptyFoodInfo() {
		mFoodInfoRepository.deleteAll();
		delAllFile(imagesUrl);
		new File(imagesUrl);
	}
	
	@RequestMapping("/emptyCache")
	public void emptyCache() {
		delAllFile(cacheUrl);
	}
	
	//用于更新窗口信息
	@RequestMapping("/uploadWindowInfo")
	public void uploadWindowInfo(
			@RequestParam(value="id") long id,
			@RequestParam(value="windowName") String windowName,
			@RequestParam(value="windowIntroduction") String windowIntroduction){
		WindowInfo info = mWindowInfoRepository.getOne(id);
		info.setWindowIntroduction(windowIntroduction);
		info.setWindowName(windowName);
		mWindowInfoRepository.save(info);
	}
	
	//用于修改一条菜品信息
	@RequestMapping("/updateFoodInfo")
	public void updateFoodInfo(
			@RequestParam(value = "foodNumber") int foodNumber,
			@RequestParam(value = "restaurantWindowNumber") int restaurantWindowNumber,
			@RequestParam(value = "foodName") String foodName,
			@RequestParam(value = "foodPrice") double foodPrice,
			@RequestParam(value = "foodImgUrl") String foodImgUrl,
			@RequestParam(value = "foodType") String foodType) throws IOException {
		FoodInfo foodInfo = mFoodInfoRepository.findFoodInfoByFoodNumber(foodNumber);
		//通过cache进行寻找
		File file = new File(cacheUrl);
		File[] children = file.listFiles();
		for (File f : children) {
			if(f.getName().split("\\.")[0].equals(foodNumber+"")) {
				File oldFile = new File(imagesUrl + foodNumber + "." + f.getName().split("\\.")[1]);
				oldFile.delete();
				Files.copy(f.toPath(), new File(imagesUrl + foodNumber + "." + f.getName().split("\\.")[1]).toPath());
				f.delete();
				break;
			}
		}
		foodInfo.setFoodImgUrl(foodImgUrl);
		foodInfo.setFoodName(foodName);
		foodInfo.setFoodNumber(foodNumber);
		foodInfo.setFoodPrice(foodPrice);
		foodInfo.setFoodType(foodType);
		foodInfo.setRestaurantWindowNumber(restaurantWindowNumber);
		mFoodInfoRepository.save(foodInfo);
	}
	
	//修改图片信息
	@ResponseBody
	@RequestMapping("/uploadImg")
	public JSONObject uploadImg(@RequestParam(value="file") MultipartFile file,  @RequestParam(value="foodNumber") String foodNumber){
		String fileName = foodNumber+"."+file.getOriginalFilename().split("\\.")[1];
		FileOutputStream out;
		JSONObject obj = new JSONObject();
		obj.put("msg", "ok");
		try {
			out = new FileOutputStream(new File(cacheUrl+fileName));
			IOUtils.copy(file.getInputStream(), out);
			out.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return obj;
	}
	
	//新增图片信息
	@ResponseBody
	@RequestMapping("/uploadNewImg")
	public long uploadNewImg(@RequestParam(value="file") MultipartFile file){
		long timeStamp = System.currentTimeMillis();
		String fileName = timeStamp+"."+file.getOriginalFilename().split("\\.")[1];
		FileOutputStream out;
		try {
			out = new FileOutputStream(new File(cacheUrl+fileName));
			IOUtils.copy(file.getInputStream(), out);
			out.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return timeStamp;
	}
	
	//添加窗口信息
	@RequestMapping("/addWindowInfo")
	public void adddWindowInfo(
			@RequestParam(value="windowName") String windowName,
			@RequestParam(value="windowIntroduction") String windowIntroduction){
		WindowInfo info = new WindowInfo();
		info.setWindowIntroduction(windowIntroduction);
		info.setWindowName(windowName);
		int num = 0;
		if(mWindowInfoRepository.getLastestWindowNumber() == null) {
			num = 0;
		}else {
			num = mWindowInfoRepository.getLastestWindowNumber();
		}
		info.setRestaurantWindowNumber(num+1);
		mWindowInfoRepository.save(info);
	}
	
	//用于新增一条菜品信息
	@RequestMapping("/addFoodInfo")
	public void addFoodInfo(
			@RequestParam(value = "restaurantWindowNumber") int restaurantWindowNumber,
			@RequestParam(value = "foodName") String foodName,
			@RequestParam(value = "foodPrice") double foodPrice,
			@RequestParam(value = "foodImgUrl") String foodImgUrl,
			@RequestParam(value = "foodType") String foodType) throws IOException {
		int lastNum;
		if(mFoodInfoRepository.getCurrentWindowLastFoodNumber(restaurantWindowNumber) == null) {
			lastNum = restaurantWindowNumber * 10000;
		}else {
			lastNum = mFoodInfoRepository.getCurrentWindowLastFoodNumber(restaurantWindowNumber);
		}
		FoodInfo foodInfo = new FoodInfo();
		//通过cache进行寻找
		File file = new File(cacheUrl);
		File newFile = null;
		File[] children = file.listFiles();
		for (File f : children) {
			if(f.getName().split("\\.")[0].equals(foodImgUrl)) {
				newFile = new File(imagesUrl + (lastNum+1) + "." + f.getName().split("\\.")[1]);
				Files.copy(f.toPath(), newFile.toPath());
				f.delete();
				break;
			}
		}
		foodInfo.setFoodImgUrl("images/"+newFile.getName());
		foodInfo.setFoodName(foodName);
		foodInfo.setFoodNumber(lastNum + 1);
		foodInfo.setFoodPrice(foodPrice);
		foodInfo.setFoodType(foodType);
		foodInfo.setRestaurantWindowNumber(restaurantWindowNumber);
		mFoodInfoRepository.save(foodInfo);
	}
	
	//增加用户信息
	@RequestMapping("/addUserInfo")
	public void addUserInfo(
			@RequestParam(value="name") String name,
			@RequestParam(value="openid") String openid,
			@RequestParam(value="head") String head) {
		UserInfo userInfo = new UserInfo();
		userInfo.setHead(head);
		userInfo.setName(name);
		userInfo.setOpenid(openid);
		mUserInfoRepository.save(userInfo);
	}

	@RequestMapping("addFoodType")
	public void addFoodType(@RequestParam(value="name") String name) {
		FoodType foodType = new FoodType();
		foodType.setName(name);
		mFoodTypeRepository.save(foodType);
	}
	
	@RequestMapping("/login")
	public String login(@RequestParam(value="code") String code) {
		RestTemplate restTemplate = new RestTemplate();
		restTemplate.getMessageConverters().add(new WxMappingJackson2HttpMessageConverter());
		WechatInfo info =restTemplate.getForObject("https://api.weixin.qq.com/sns/jscode2session?appid=wx26071ca8436f43ee&secret=eb6c2e00b8bc2d94ad30c0cb59058112&js_code="+code+"&grant_type=authorization_code", WechatInfo.class);
		return info.getOpenid();
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping("/pay")
	public JSONObject pay(@RequestBody JSONObject json) {
		JSONObject obj = new JSONObject();
		obj.put("msg", "ok");
		String openid = json.get("openid").toString();
		String name = (String) json.get("name");
		List<ShopCar> shopCars = JSONArray.toList(json.getJSONArray("shopCar"), new ShopCar(), new JsonConfig());
		Date date = new Date((long) json.get("date"));
		for (ShopCar shopCar : shopCars) {
			for(int i = 0; i < shopCar.getNum(); i++) {
				OrderInfo orderInfo = new OrderInfo();
				orderInfo.setAllPrice(shopCar.getPrice());
				orderInfo.setDate(date);
				orderInfo.setFoodName(shopCar.getName());
				orderInfo.setFoodNumber(shopCar.getId());
				orderInfo.setName(name);
				orderInfo.setNumber(1);
				orderInfo.setOpenid(openid);
				orderInfo.setPrice(shopCar.getPrice());
				orderInfo.setWindowNum(shopCar.getWindowNum());
				orderInfo.setImg(shopCar.getImg());
				orderInfo.setStatus(0);
				mOrderInfoRepository.save(orderInfo);
				WebSocketServer.orderQueue.add(orderInfo);
				WebSocketServer.sendMessageToClient(shopCar.getId()+"", shopCar.getWindowNum()+"");
			}
		}
		return obj;
	}
	
	@RequestMapping("/employeeLogin")
	public int employeeLogin(
			@RequestParam(value="id") String id, 
			@RequestParam(value="pwd") String pwd,
			HttpSession session) {
		List<EmployeeInfo> list = mEmployeeInfoRepository.findAll();
		for(int i = 0; i < list.size(); i++) {
			EmployeeInfo info = list.get(i);
			if(info.getUserName().equals(id) && info.getPwd().equals(pwd)) {
				session.setAttribute("id", id);
				session.setAttribute("pwd", pwd);
				return info.getWindowNum();
			}
		}
		return -1;
	}
	
	@RequestMapping("/receiveSuggest")
	public void receiveSuggest(@RequestParam(value="text") String text) {
		//接收时间
		//接收内容
		Suggest s = new Suggest();
		s.setText(text);
		s.setDate(new Date());
		mSuggestRepository.save(s);	
	}
	
	@RequestMapping("/receiveWaiting")
	public synchronized void receiveWating(@RequestParam(value="foodNumber") int foodNumber) {
		System.out.println("aaa");
		for (OrderInfo info : WebSocketServer.orderQueue) {
			if(info.getFoodNumber() == foodNumber) {
				info.setStatus(2);
				mOrderInfoRepository.save(info);
				//删除订单队列已接受的订单
				WebSocketServer.orderQueue.remove(info);
				System.out.println("aaa:"+WebSocketServer.orderQueue.size());
				break;
			}
		}
	}
	
	@RequestMapping("/receiveDelivered")
	public void receiveDelivered(@RequestParam(value="foodNumber") int foodNumber) {
		for (OrderInfo info : WebSocketServer.orderQueue) {
			if(info.getFoodNumber() == foodNumber) {
				info.setStatus(1);
				mOrderInfoRepository.save(info);
//					//删除订单队列已接受的订单
//					WebSocketServer.orderQueue.remove(info);
				break;
			}
		}
	}
	
	@RequestMapping("/receiveFinished")
	public void receiveFinished(@RequestParam(value="id") long id) {
		OrderInfo info = mOrderInfoRepository.getOne(id);
		info.setStatus(3);
		mOrderInfoRepository.save(info);
	}
	
	public void deleteFoodInfo(int foodNumber) {
		FoodInfo delInfo = mFoodInfoRepository.findFoodInfoByFoodNumber(foodNumber);
		int windowNum = mFoodInfoRepository.findFoodInfoByFoodNumber(foodNumber).getRestaurantWindowNumber();
		mFoodInfoRepository.delete(delInfo);
		List<FoodInfo> infos = mFoodInfoRepository.findFoodInfoByRestaurantWindowNumber(windowNum);
		File f = new File(imagesUrl+(delInfo.getFoodImgUrl().split("/")[4]));
		f.delete();
		for (FoodInfo foodInfo : infos) {
			int num = foodInfo.getFoodNumber();
			if(num > foodNumber) {
				File oldFile = new File(imagesUrl+foodInfo.getFoodImgUrl().split("/")[4]);
				foodInfo.setFoodNumber(num-1);
				String newUrl = foodInfo.getFoodNumber()+"."+foodInfo.getFoodImgUrl().split("\\.")[1];
				File newFile = new File(imagesUrl+newUrl);
				oldFile.renameTo(newFile);
				foodInfo.setFoodImgUrl("images/"+newUrl);
				mFoodInfoRepository.save(foodInfo);
			}
		}
	}
	
	public boolean delAllFile(String path) {
	    boolean flag = false;
	    File file = new File(path);
	    if (!file.exists()) {
	    	return flag;
	    }
	    if (!file.isDirectory()) {
	    	return flag;
	    }
	    String[] tempList = file.list();
	    File temp = null;
	    for (int i = 0; i < tempList.length; i++) {
	    	if (path.endsWith(File.separator)) {
	    		temp = new File(path + tempList[i]);
	        } else {
	            temp = new File(path + File.separator + tempList[i]);
	        }
	        if (temp.isFile()) {
	            temp.delete();
	        }
	        if (temp.isDirectory()) {
	        	delAllFile(path + "/" + tempList[i]);//先删除文件夹里面的文件
	            delFolder(path + "/" + tempList[i]);//再删除空文件夹
	            flag = true;
	        }
	    }
	    return flag;
	}

	public void delFolder(String folderPath) {
		try {
			delAllFile(folderPath); //删除完里面所有内容
	        String filePath = folderPath;
	        filePath = filePath.toString();
	        java.io.File myFilePath = new java.io.File(filePath);
	        myFilePath.delete(); //删除空文件夹
		} catch (Exception e) {
			e.printStackTrace(); 
	    }
	}

	public class WxMappingJackson2HttpMessageConverter extends MappingJackson2HttpMessageConverter {
	    public WxMappingJackson2HttpMessageConverter(){
	        List<MediaType> mediaTypes = new ArrayList<>();
	        mediaTypes.add(MediaType.TEXT_PLAIN);
	        mediaTypes.add(MediaType.TEXT_HTML);  //加入text/html类型的支持
	        setSupportedMediaTypes(mediaTypes);// tag6
	    }
	}
	
	@RequestMapping("/getWindowSales")
	public List<WindowSales> getWindowSales(){
		List<WindowSales> sales = new ArrayList<WindowSales>();
		List<WindowInfo> infos = mWindowInfoRepository.findAll();
		for (WindowInfo windowInfo : infos) {
			int num = mOrderInfoRepository.getWindowSalesVolume(windowInfo.getRestaurantWindowNumber());
			sales.add(new WindowSales(windowInfo.getWindowName(), num));
		}
		return sales;
	}
	
	@RequestMapping("/getFoodTopSales")
	public List<FoodSales> getFoodTopSales(){
		List<FoodSales> sales = new ArrayList<FoodSales>();
		List<FoodInfo> infos = mFoodInfoRepository.findAll();
		int max[] = {0,0,0,0,0};
		String maxName[] = {"","","","",""};
		for (FoodInfo foodInfo : infos) {
			int num = mOrderInfoRepository.getFoodSalesVolume(foodInfo.getFoodNumber());
			int count = 0;
			for(; count < max.length; count++) {
				if(num < max[count]) {
					break;
				}
			}
			if(count == max.length) { //说明它比所有都大
				int i = max.length - 1;
				for(; i >= 0 ; i--) {
					if(i == 0) {
						max[i] = num;
						maxName[i] = foodInfo.getFoodName();
					}else {
						max[i] = max[i-1];
						maxName[i] = maxName[i-1];
					}
					
				}
			}
			
		}
		for(int i = 0; i < maxName.length; i++) {
			if(max[i] > 0) {
				sales.add(new FoodSales(maxName[i], max[i]));
			}
		}
		return sales;
	}
	
	@RequestMapping("/getTimeSales")
	public List<Integer> getTimeSales(){
		Calendar cale = Calendar.getInstance();  
		int year = cale.get(Calendar.YEAR);
		List<Integer> info = new ArrayList<Integer>();
		for(int i = 1; i <= 12; i++) {
			String timeBottom;
			String timeTop;
			if(i == 1 || i == 3 || i == 5 || i == 7 || i == 8 || i == 10 || i == 12) {
				timeBottom = year+"-"+i+"-01 00:00:00";
				timeTop = year+"-"+i+"-31 23:59:59";
			}else if(i == 2) {
				if((year%4 == 0 && year%100 != 0) || (year%100 == 0 && year%400 == 0)) {
					timeBottom = year+"-"+i+"-01 00:00:00";
					timeTop = year+"-"+i+"-29 23:59:59";
				}else {
					timeBottom = year+"-"+i+"-01 00:00:00";
					timeTop = year+"-"+i+"-28 23:59:59";
				}
			}else {
				timeBottom = year+"-"+i+"-01 00:00:00";
				timeTop = year+"-"+i+"-30 23:59:59";
			}
			info.add(mOrderInfoRepository.getTimeSalesVolume(timeBottom, timeTop));
		}
		return info;
	}
	
	@RequestMapping("/exit")
	public boolean exit(HttpSession session) {
		session.removeAttribute("id");
		session.removeAttribute("pwd");
		return true;
	}
}
	