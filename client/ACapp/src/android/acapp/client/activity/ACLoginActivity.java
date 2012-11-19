package android.acapp.client.activity;

import java.text.SimpleDateFormat;

import com.tencent.weibo.oauthv2.OAuthV2;
import com.tencent.weibo.oauthv2.OAuthV2Client;
import com.tencent.weibo.webview.OAuthV2AuthorizeWebView;
import com.weibo.sdk.android.Oauth2AccessToken;
import com.weibo.sdk.android.Weibo;
import com.weibo.sdk.android.WeiboAuthListener;
import com.weibo.sdk.android.WeiboDialogError;
import com.weibo.sdk.android.WeiboException;
import com.weibo.sdk.android.keep.AccessTokenKeeper;

import android.os.Bundle;
import android.app.Activity;
import android.content.Intent;
import android.util.Log;
import android.view.Menu;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

public class ACLoginActivity extends Activity {

	/**
	 * @author trampboy
	 *
	 */
    private OAuthV2 qqOAuth;
    //!!!请根据您的实际情况修改!!!      认证成功后浏览器会被重定向到这个url中  必须与注册时填写的一致
    private String QQ_REDIRECTURI="http://app.t.qq.com/app/playtest/100671628";                   
    //!!!请根据您的实际情况修改!!!      换为您为自己的应用申请到的APP KEY
    private String QQ_CLIENTID = "100671628"; 
    //!!!请根据您的实际情况修改!!!      换为您为自己的应用申请到的APP SECRET
    private String QQ_CLIENTSECRET="8ca549438dba7cd4a6cf32f4ae102020";
    private Weibo sinaWeibo;
	private static final String SINA_CONSUMER_KEY = "2782329240";// 替换为开发者的appkey，例如"1646212860";
	private static final String SINA_REDIRECT_URL = "http://weibo.com/jhg19900321";
	public static Oauth2AccessToken accessToken ;
	private Button btn_weiboLogin,btn_weiboCancel,btn_qqLogin,btn_qqCancel;
	private TextView tv_result;
	private static final String TAG = ACLoginActivity.class.getSimpleName();
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        //新浪微博登陆
        sinaWeibo = Weibo.getInstance(SINA_CONSUMER_KEY, SINA_REDIRECT_URL);
        //qq登陆
        qqOAuth=new OAuthV2(QQ_REDIRECTURI);
        qqOAuth.setClientId(QQ_CLIENTID);
        qqOAuth.setClientSecret(QQ_CLIENTSECRET);
        //关闭OAuthV2Client中的默认开启的QHttpClient。
        OAuthV2Client.getQHttpClient().shutdownConnection();
        
        btn_weiboLogin = (Button)findViewById(R.id.btn_weiboLogin);
        btn_weiboCancel = (Button)findViewById(R.id.btn_weiboCancel);
        btn_qqLogin = (Button)findViewById(R.id.btn_qqLogin);
        btn_qqCancel = (Button)findViewById(R.id.btn_qqCancel);
        tv_result = (TextView)findViewById(R.id.tv_result);
        btn_weiboLogin.setOnClickListener(new View.OnClickListener() {
			public void onClick(View v) {
				sinaWeibo.authorize(ACLoginActivity.this, new AuthDialogListener());
			}
		});
        btn_weiboCancel.setOnClickListener(new View.OnClickListener() {
			public void onClick(View v) {
				AccessTokenKeeper.clear(ACLoginActivity.this);
				btn_weiboCancel.setVisibility(View.INVISIBLE);
			}
		});
        btn_qqLogin.setOnClickListener(new View.OnClickListener() {
			public void onClick(View v) {
				Intent intent = new Intent();
                intent = new Intent(ACLoginActivity.this, OAuthV2AuthorizeWebView.class);//创建Intent，使用WebView让用户授权
                intent.putExtra("oauth", qqOAuth);
                startActivityForResult(intent,2);   
			}
		});
    }
    
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.activity_login, menu);
        return true;
    }
    
    /**
     * qq登陆，用户使用back键打断登陆，则回调该接口
     */
    public void onBackPressed() {
        finish();
    }
    
    /**
     * qq登陆
     * 通过读取OAuthV2AuthorizeWebView返回的Intent，获取用户授权信息
     */
    protected void onActivityResult(int requestCode, int resultCode, Intent data)   {
        if (requestCode==2) {
            if (resultCode==OAuthV2AuthorizeWebView.RESULT_CODE)    {
                qqOAuth=(OAuthV2) data.getExtras().getSerializable("oauth");
                if(qqOAuth.getStatus()==0)
                    Toast.makeText(getApplicationContext(), "登陆成功", Toast.LENGTH_SHORT).show();
            }
        }
    }
    
    /**
     * 新浪微博登陆监听器
     * @author trampboy
     *
     */
	class AuthDialogListener implements WeiboAuthListener {
		public void onComplete(Bundle values) {
			String token = values.getString("access_token");
			String expires_in = values.getString("expires_in");
			ACLoginActivity.accessToken = new Oauth2AccessToken(token, expires_in);
			if (ACLoginActivity.accessToken.isSessionValid()) {
				String date = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss").format(new java.util.Date(ACLoginActivity.accessToken.getExpiresTime()));
				tv_result.setText("认证成功: \r\n access_token: "+ token + "\r\n" + "expires_in: " + expires_in+"\r\n有效期："+date);
				btn_weiboCancel.setVisibility(View.VISIBLE);
				AccessTokenKeeper.keepAccessToken(ACLoginActivity.this, accessToken);
				Toast.makeText(ACLoginActivity.this, "认证成功", Toast.LENGTH_SHORT).show();
			}
		}
		public void onError(WeiboDialogError e) {
			Toast.makeText(getApplicationContext(), "Auth error : " + e.getMessage(),
					Toast.LENGTH_LONG).show();
		}
		public void onCancel() {
			Toast.makeText(getApplicationContext(), "Auth cancel", Toast.LENGTH_LONG).show();
		}
		public void onWeiboException(WeiboException e) {
			Toast.makeText(getApplicationContext(), "Auth exception : " + e.getMessage(),
					Toast.LENGTH_LONG).show();
		}
	}
}
