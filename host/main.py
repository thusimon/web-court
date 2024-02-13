# https://chromium.googlesource.com/chromium/src.git/+/62.0.3178.1/chrome/common/extensions/docs/examples/api/nativeMessaging/host

from PyQt6.QtCore import QSize, Qt
from PyQt6.QtGui import QAction
from PyQt6.QtWidgets import QMenu, QApplication, QLineEdit, QFrame, QTextEdit, QMainWindow, QLabel, QLineEdit, QVBoxLayout, QWidget, QPushButton

import struct
import sys
import json
import threading
import queue

def send_message(message):
  # Write message size.
  sys.stdout.write(struct.pack('I', len(message)))
  # Write the message itself.
  sys.stdout.write(message)
  sys.stdout.flush()

# Thread that reads messages from the webapp.
def read_thread_func(queue):
  message_number = 0
  while 1:
    # Read the message length (first 4 bytes).
    text_length_bytes = sys.stdin.read(4)
    if len(text_length_bytes) == 0:
      if queue:
        queue.put(None)
      sys.exit(0)
    # Unpack message length as 4 byte integer.
    text_length = struct.unpack('i', text_length_bytes)[0]
    # Read the text (JSON object) of the message.
    text = sys.stdin.read(text_length).decode('utf-8')
    if queue:
      queue.put(text)
    else:
      # In headless mode just send an echo message back.
      send_message('{"resp": %s}' % text)

# Subclass QMainWindow to customize your application's main window
class MainWindow(QMainWindow):
  def __init__(self, q: queue.Queue):
    super().__init__()
    self.q = q
    self.setWindowTitle('Host')

    self.setContextMenuPolicy(Qt.ContextMenuPolicy.CustomContextMenu)
    self.customContextMenuRequested.connect(self.on_context_menu)
    
    pagelayout = QVBoxLayout()
    self.buttonSend = QPushButton('Send')
    self.buttonSend.setFixedSize(QSize(60, 30))
    self.buttonSend.clicked.connect(self.sendMessageButtonClicked)
    self.lineEdit = QLineEdit()
    lineSep = QFrame()
    lineSep.setFrameShape(QFrame.Shape.HLine)
    self.textEdit = QTextEdit()
    
    pagelayout.addWidget(self.lineEdit)
    pagelayout.addWidget(self.buttonSend)
    pagelayout.addWidget(lineSep)
    pagelayout.addWidget(self.textEdit)

    container = QWidget()
    container.setLayout(pagelayout)
    
    self.setFixedSize(QSize(400, 300))

    # Set the central widget of the Window.
    self.setCentralWidget(container)

  def sendMessageButtonClicked(self):
    msg = self.lineEdit.text()
    try:
      json.loads(msg)
      #msg is a json, send it
    except ValueError as e:
      pass

  def on_context_menu(self, pos):
    context = QMenu(self)
    context.addAction(QAction('test 1', self))
    context.exec(self.mapToGlobal(pos))

  def processMessages(self):
    while not self.queue.empty():
      message = self.queue.get_nowait()
      if message == None:
        self.quit()
        return
      self.log("Received %s" % message)
    self.after(100, self.processMessages)

def Main():
  # You need one (and only one) QApplication instance per application.
  # Pass in sys.argv to allow command line arguments for your app.
  # If you know you won't use command line arguments QApplication([]) works too.
  app = QApplication(sys.argv)
  q = queue.Queue()
  # Create a Qt widget, which will be our window.
  window = MainWindow(q)
  window.show()  # IMPORTANT!!!!! Windows are hidden by default.

  # Start the event loop.
  app.exec()
  
  thread = threading.Thread(target=read_thread_func, args=(q,))
  thread.daemon = True
  thread.start()
  sys.exit(0)

if __name__ == '__main__':
  Main()

# Your application won't reach here until you exit and the event
# loop has stopped.
