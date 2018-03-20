// hello.cc
  #include <node.h>
  #include <string>

  namespace demo {

    using v8::FunctionCallbackInfo;
    using v8::Isolate;
    using v8::Local;
    using v8::Object;
    using v8::String;
    using v8::Value;
    using std::string;
    void updatematrix(int matrix[][4],int n){
      for (int i = 0; i < 4*n; i++) {
        matrix[(i%n)][(i/n)]+=1;
        if(matrix[(i%n)][(i/n)]==2)
        {matrix[(i%n)][(i/n)]=0;
          continue;
        }
        else{
          break;
        }
        if(i/n==4&&i%n==n-1)
        printf("%s\n","" );
      }
    }
    char result(int matrix[][4],int n){
      string result="";
      for (size_t i = 0; i < 4*n; i++) {
        result+=i;
      }
    }

    void Method(const FunctionCallbackInfo<Value>& args) {
      Isolate* isolate = args.GetIsolate();

      int n=args[0]->NumberValue();
      int Matrix[n][4];
      for (int i = 0; i < 4*n; i++) {
        Matrix[(i%n)][(i/n)]=0;
      }
      for (size_t j = 0; j < 10&&Matrix[n-1][3]==0; j+=0) {
        updatematrix(Matrix,n);
        for (int i = 0; i < 4*n; i++) {
          printf("%d ",Matrix[(i%n)][(i/n)]);
        }
        printf("\n");
      }

      printf("\n");
      args.GetReturnValue().Set(0);
    }


    void init(Local<Object> exports) {
      NODE_SET_METHOD(exports, "hello", Method);
    }

    NODE_MODULE(NODE_GYP_MODULE_NAME, init)

  }  // namespace demo
