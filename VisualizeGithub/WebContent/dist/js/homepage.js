$(document).ready(function(){
	appendOption();
	
});

function appendOption(){
	$("#type").append('<option selected value="repository">專案名稱</option>'
			+'<option value="code">程式碼</option>'
			+'<option value="commit">提交</option>'
			+'<option value="issue">議題</option>'
			+'<option value="user">使用者</option>'
			+'<option value="topic">主題</option>');
	$("#language").append('<option selected>不限語言</option>'
	           +'<option>Java</option>'
	           +'<option>C++</option>'
	           +'<option>Python</option>'
	           +'<option>自訂語言</option>');
	
	$("#date").append('<option selected>不限日期</option>'
			+'<option>一天內</option>'
            +'<option>一週內</option>'
            +'<option>一個月內</option>'
            +'<option>半年內</option>'
            +'<option>一年內</option>'
            +'<option>自訂日期範圍</option>');
}