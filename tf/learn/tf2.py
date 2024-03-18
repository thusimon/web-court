import tensorflow as tf
import numpy as np

x = tf.Variable(0, name='x')
for i in range(5):
  x = x + 1
  print("x:",x)

# normal distribution:
w = tf.Variable(tf.random.normal([784, 10], stddev=0.01))
# mean of an array:
b = tf.Variable([10,20,30,40,50,60],name='t')
print("w: ",w)
print("b: ",tf.reduce_mean(input_tensor=b))

a = [[1,2,3], [30,20,10], [40,60,50], [40,60,50]]
b = tf.Variable(a, name='b')
print("b:", b)
print('b shape:', b.shape)
print("b-dim1: ",tf.argmax(b,1))
print("b-dim0: ",tf.argmax(b,0))

x = tf.constant([100,200,300], name="x")
y = tf.constant([1,2,3], name="y")
sum_x = tf.reduce_sum(x, name="sum_x")
prod_y = tf.reduce_prod(y, name="prod_y")
div_xy = tf.math.divide(sum_x, prod_y, name="div_xy")
# 'div' is deprecated in favor of operator or tf.math.divide
print("sum_x: ",sum_x)
print("prod_y:",prod_y)
print("div_xy:",div_xy)

elems = np.array([1, 2, 3, 4, 5])
doubles = tf.map_fn(lambda x: 2 * x, elems)
print("doubles:",doubles)

def neg_pos_map(x):
  print('x: ', x)
  return x[0]*x[1]

elems = (np.array([1, 2, 3]), np.array([-1, 1, -1]))
neg_pos = tf.map_fn(neg_pos_map, elems, dtype=tf.int32)
print("neg_pos:",neg_pos)