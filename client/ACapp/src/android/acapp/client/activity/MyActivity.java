package android.acapp.client.activity;

import android.app.Activity;
import android.os.Bundle;
import android.widget.Button;


public class MyActivity extends Activity{
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		
		Button btn = new Button(this);
		btn.setText("hello");
		setContentView(btn);
	}

}
