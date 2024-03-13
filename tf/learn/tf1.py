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
