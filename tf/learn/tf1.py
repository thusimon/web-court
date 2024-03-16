import numpy as np
import tensorflow as tf

matrix1 = np.array([(2,2,2),(2,2,2),(2,2,2)],dtype = 'int32')
matrix2 = np.array([(1,1,1),(1,1,1),(1,1,1)],dtype = 'int32')

matrix1 = tf.constant(matrix1)
matrix2 = tf.constant(matrix2)
matrix_product = tf.matmul(matrix1, matrix2)
matrix_sum = tf.add(matrix1,matrix2)

print(matrix_product)
print(matrix_sum)

matrix_3 = np.array([(2,7,2),(1,4,2),(9,0,2)],dtype = 'float32')
print(matrix_3)

matrix_det = tf.linalg.det(matrix_3)
print(matrix_det)

aconst = tf.constant(3.0)
b = tf.Variable(3, name="b")
x = tf.Variable(2, name="x")
z = tf.Variable(5*x, name="z")
W = tf.Variable(20)
lm = tf.Variable(W*x + b, name="lm")

x = tf.constant(5,name="x")
y = tf.constant(8,name="y")
@tf.function
def calc_prod(x, y):
  z = 2*x + 3*y
  return z
result = calc_prod(x, y)
print('result =',result)

v = tf.Variable([[1., 2., 3.], [4., 5., 6.]])
print("v.value():", v.value())
print("")
print("v.numpy():", v.numpy())
print("")
v.assign(2 * v)
v[0, 1].assign(42)
v[1].assign([7., 8., 9.])
print("v:",v)
print("")

def calc_prod2(x, y):
  z = 2*x + 3*y
  return z
print(tf.autograph.to_code(calc_prod2))

x = tf.constant([[1., 2., 3.], [4., 5., 6.]])
print("x:", x)
print("")
print("x.shape:", x.shape)
print("")
print("x.dtype:", x.dtype)
print("")
print("x[:, 1:]:", x[:, 1:])
print("")
print("x[..., 1, tf.newaxis]:", x[..., 1, tf.newaxis])
print("")
print("x + 10:", x + 10)
print("")
print("tf.square(x):", tf.square(x))
print("")
print("x @ tf.transpose(x):", x @ tf.transpose(x))
m1 = tf.constant([[1., 2., 4.], [3., 6., 12.]])
print("m1: ", m1)
print("m1 + 50: ", m1 + 50)
print("m1 * 2: ", m1 * 2)
print("tf.square(m1): ", tf.square(m1))

m1 = tf.constant([[3., 3.]]) # 1x2
m2 = tf.constant([[2.],[2.]]) # 2x1
p1 = tf.matmul(m1, m2)
print('p1:',p1)

x1 = np.array([[1.,2.],[3.,4.]])
x2 = tf.convert_to_tensor(value=x1, dtype=tf.float32)
print ('x1:',x1)
print ('x2:',x2)

try:
  sum1 = tf.constant(1) + tf.constant(1.0)
  print(sum1)
except tf.errors.InvalidArgumentError as ex:
  print(ex)

