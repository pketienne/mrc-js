class TSV
  attr_accessor :uri, :records

  def initialize(uri)
    @uri = uri
    @records = []

    File.open(@uri).each do | record |
      @records.push(Record.new(record))
    end

    @records.shift
  end

  def list
    @records.each do | record |
      puts record.inspect
    end
  end

  def size
    @records.size
  end
  
  def line_number_first_labels
    @records.map { |r| r.line_number_first_label }
  end

  def line_number_last_labels
    @records.map { |r| r.line_number_last_label }
  end
  
end
