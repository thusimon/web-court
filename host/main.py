from PyQt6.QtCore import QSize, Qt
from PyQt6.QtGui import QAction
from PyQt6.QtWidgets import QMenu, QApplication, QMainWindow, QLabel, QLineEdit, QVBoxLayout, QWidget, QPushButton

# Only needed for access to command line arguments
import sys

# Subclass QMainWindow to customize your application's main window
class MainWindow(QMainWindow):
  def __init__(self):
    super().__init__()

    self.setWindowTitle('Host')

    self.setContextMenuPolicy(Qt.ContextMenuPolicy.CustomContextMenu)
    self.customContextMenuRequested.connect(self.on_context_menu)
    
    button1 = QPushButton('Send')
    button1.setFixedSize(QSize(60, 30))
    button1.clicked.connect(self.sendMessageButtonClicked)
    
    button2 = QPushButton('Check')
    button2.setFixedSize(QSize(60, 30))
    button2.setCheckable(True)
    button2.clicked.connect(self.checkButtonClicked)

    self.label = QLabel()
    self.input = QLineEdit()
    self.input.textChanged.connect(self.label.setText)
    layout = QVBoxLayout()
    layout.addWidget(self.input)
    layout.addWidget(self.label)
    container = QWidget()
    container.setLayout(layout)
    
    self.setFixedSize(QSize(400, 300))

    # Set the central widget of the Window.
    self.setCentralWidget(button1)
    self.setCentralWidget(button2)
    self.setCentralWidget(container)

  def sendMessageButtonClicked(self):
    print('send message button clicked')

  def checkButtonClicked(self, checked):
    print(f'check button = {checked}')

  def on_context_menu(self, pos):
    context = QMenu(self)
    context.addAction(QAction("test 1", self))
    context.addAction(QAction("test 2", self))
    context.addAction(QAction("test 3", self))
    context.exec(self.mapToGlobal(pos))

# You need one (and only one) QApplication instance per application.
# Pass in sys.argv to allow command line arguments for your app.
# If you know you won't use command line arguments QApplication([]) works too.
app = QApplication(sys.argv)

# Create a Qt widget, which will be our window.
window = MainWindow()
window.show()  # IMPORTANT!!!!! Windows are hidden by default.

# Start the event loop.
app.exec()


# Your application won't reach here until you exit and the event
# loop has stopped.